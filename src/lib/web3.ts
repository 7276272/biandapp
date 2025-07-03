import { ethers } from 'ethers'

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

export const switchToMainnet = async (): Promise<void> => {
  if (!window.ethereum) throw new Error('MetaMask not installed')

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x1' }], // Mainnet
    })
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 4902) {
      // Chain doesn't exist, add it
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x1',
          chainName: 'Ethereum Mainnet',
          nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: ['https://mainnet.infura.io/v3/YOUR_PROJECT_ID'],
          blockExplorerUrls: ['https://etherscan.io/'],
        }],
      })
    } else {
      throw error
    }
  }
}

// Types for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      on: (event: string, callback: (data: unknown) => void) => void
      removeListener: (event: string, callback: (data: unknown) => void) => void
      selectedAddress: string | null
      chainId: string | null
    }
  }
}
