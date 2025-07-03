import { ethers } from 'ethers'
import { CURRENT_NETWORK } from './contracts'

export interface WalletState {
  isConnected: boolean
  address: string | null
  balance: string | null
  chainId: number | null
  isLoading: boolean
  error: string | null
}

export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum)
  }
  return null
}

export const formatAddress = (address: string): string => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatBalance = (balance: string): string => {
  const num = Number.parseFloat(balance)
  if (num === 0) return '0.000'
  if (num < 0.001) return '< 0.001'
  return num.toFixed(3)
}

export const formatEther = (wei: bigint): string => {
  return ethers.formatEther(wei)
}

export const isMetaMaskInstalled = (): boolean => {
  if (typeof window === 'undefined') return false
  return Boolean(window.ethereum?.isMetaMask)
}

export const switchToCurrentNetwork = async (): Promise<void> => {
  if (!window.ethereum) throw new Error('MetaMask not installed')

  const chainIdHex = `0x${CURRENT_NETWORK.CHAIN_ID.toString(16)}`
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    })
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 4902) {
      // Chain doesn't exist, add it
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: chainIdHex,
          chainName: getNetworkName(),
          nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: [CURRENT_NETWORK.RPC_URL],
          blockExplorerUrls: [CURRENT_NETWORK.EXPLORER_URL],
        }],
      })
    } else {
      throw error
    }
  }
}

// 获取当前网络名称
const getNetworkName = (): string => {
  if (CURRENT_NETWORK.CHAIN_ID === 1) return 'Ethereum Mainnet (Tenderly)'
  if (CURRENT_NETWORK.CHAIN_ID === 56) return 'BSC Mainnet'
  if (CURRENT_NETWORK.CHAIN_ID === 97) return 'BSC Testnet'
  return 'Unknown Network'
}

// 保留旧函数名以兼容
export const switchToMainnet = switchToCurrentNetwork

// Note: window.ethereum types are defined globally elsewhere
