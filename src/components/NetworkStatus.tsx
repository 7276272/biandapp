'use client'

import { useEffect, useState } from 'react'
import { CURRENT_NETWORK } from '@/lib/contracts'
import { useWallet } from '@/contexts/WalletContext'

export function NetworkStatus() {
  const [currentChainId, setCurrentChainId] = useState<number | null>(null)
  const { isConnected } = useWallet()

  useEffect(() => {
    const checkNetwork = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' })
          setCurrentChainId(parseInt(chainId, 16))
        } catch (error) {
          console.error('获取网络ID失败:', error)
        }
      }
    }

    if (isConnected) {
      checkNetwork()
    }
  }, [isConnected])

  const isCorrectNetwork = currentChainId === CURRENT_NETWORK.CHAIN_ID
  
  return (
    <div className="bg-black/80 border border-yellow-500/20 rounded-lg p-3 mb-4">
      <h4 className="text-yellow-500 font-bold mb-2">网络状态</h4>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">目标网络:</span>
          <span className="text-white">
            {CURRENT_NETWORK.CHAIN_ID === 1 ? 'Ethereum Mainnet (Tenderly)' : 
             CURRENT_NETWORK.CHAIN_ID === 56 ? 'BSC Mainnet' : 
             CURRENT_NETWORK.CHAIN_ID === 97 ? 'BSC Testnet' : 
             'Unknown'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Chain ID:</span>
          <span className="text-white">{CURRENT_NETWORK.CHAIN_ID}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">RPC URL:</span>
          <span className="text-white text-xs font-mono break-all">
            {CURRENT_NETWORK.RPC_URL}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">当前钱包网络:</span>
          <span className={isCorrectNetwork ? 'text-green-500' : 'text-red-500'}>
            {currentChainId || '未连接'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">网络匹配:</span>
          <span className={isCorrectNetwork ? 'text-green-500' : 'text-red-500'}>
            {isConnected ? (isCorrectNetwork ? '✅ 正确' : '❌ 不匹配') : '未连接'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">USDT合约:</span>
          <span className="text-white text-xs font-mono">
            {CURRENT_NETWORK.USDT_CONTRACT.slice(0, 10)}...{CURRENT_NETWORK.USDT_CONTRACT.slice(-8)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">资金地址:</span>
          <span className="text-white text-xs font-mono">
            {CURRENT_NETWORK.TREASURY_ADDRESS.slice(0, 10)}...{CURRENT_NETWORK.TREASURY_ADDRESS.slice(-8)}
          </span>
        </div>
      </div>
      
      {isConnected && !isCorrectNetwork && (
        <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400">
          ⚠️ 请切换到正确的网络
        </div>
      )}
    </div>
  )
} 