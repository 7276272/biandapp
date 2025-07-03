'use client'

import React, { useState, useEffect } from 'react'
import { useWallet } from '@/contexts/WalletContext'
import { useI18n } from '@/hooks/useI18n'
import { api } from '@/lib/api'

interface WalletProvider {
  name: string
  icon: string
  id: string
  description: string
}

const WALLET_PROVIDERS: WalletProvider[] = [
  {
    name: 'MetaMask',
    icon: '🦊',
    id: 'metamask',
    description: 'Connect using MetaMask wallet'
  },
  {
    name: 'Trust Wallet',
    icon: '🛡️',
    id: 'trust',
    description: 'Connect using Trust Wallet'
  },
  {
    name: 'TokenPocket',
    icon: '🎯',
    id: 'tokenpocket',
    description: 'Connect using TokenPocket'
  },
  {
    name: 'imToken',
    icon: '🔑',
    id: 'imtoken',
    description: 'Connect using imToken'
  },
  {
    name: 'WalletConnect',
    icon: '🔗',
    id: 'walletconnect',
    description: 'Connect using WalletConnect protocol'
  }
]

interface WalletConnectProps {
  showBalance?: boolean
  onConnect?: (address: string) => void
  onDisconnect?: () => void
  className?: string
}

export default function WalletConnect({
  showBalance = true,
  onConnect,
  onDisconnect,
  className = ''
}: WalletConnectProps) {
  const { t } = useI18n()
  const { 
    account, 
    chainId, 
    balance, 
    isConnecting, 
    error, 
    connectWallet, 
    disconnectWallet,
    switchNetwork
  } = useWallet()
  
  const [showModal, setShowModal] = useState(false)
  const [isRecordingConnection, setIsRecordingConnection] = useState(false)

  // 记录钱包连接到后端
  const recordWalletConnection = async (address: string, walletType: string) => {
    try {
      setIsRecordingConnection(true)
      
      const connectionData = {
        address,
        timestamp: new Date().toISOString(),
        platform: navigator.platform || 'Unknown',
        device_model: navigator.userAgent || 'Unknown',
        os_version: navigator.platform || 'Unknown',
        app_version: '1.0.0',
        language: localStorage.getItem('language') || 'zh',
        user_agent: navigator.userAgent || 'Unknown',
        connect_type: walletType
      }

      await api.recordWalletConnect(connectionData)
      console.log('✅ 钱包连接记录成功', connectionData)
      
      // 尝试创建用户档案（如果不存在）
      try {
        await api.bindUser(address)
        console.log('✅ 用户绑定成功')
      } catch (bindError) {
        console.log('ℹ️ 用户可能已存在:', bindError)
      }
      
    } catch (error) {
      console.error('❌ 记录钱包连接失败:', error)
    } finally {
      setIsRecordingConnection(false)
    }
  }

  // 处理钱包连接
  const handleWalletConnect = async (providerId: string) => {
    try {
      const address = await connectWallet(providerId)
      if (address) {
        await recordWalletConnection(address, providerId)
        setShowModal(false)
        if (onConnect) {
          onConnect(address)
        }
      }
    } catch (error) {
      console.error('钱包连接失败:', error)
    }
  }

  // 处理钱包断开连接
  const handleDisconnect = async () => {
    await disconnectWallet()
    if (onDisconnect) {
      onDisconnect()
    }
  }

  // 复制地址
  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account)
      // 这里可以添加一个toast通知
    }
  }

  // 格式化地址显示
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // 格式化余额
  const formatBalance = (balance: string) => {
    return parseFloat(balance).toFixed(4)
  }

  // 如果已连接，显示连接信息
  if (account) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('wallet.connected')}
          </h3>
          <button
            onClick={handleDisconnect}
            className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            {t('wallet.disconnect')}
          </button>
        </div>

        <div className="space-y-3">
          {/* 钱包地址 */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('wallet.address')}
              </p>
              <p className="font-mono text-sm text-gray-900 dark:text-white">
                {formatAddress(account)}
              </p>
            </div>
            <button
              onClick={copyAddress}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title={t('wallet.copy_address')}
            >
              📋
            </button>
          </div>

          {/* 网络信息 */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('wallet.network')}
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                {chainId === '0x38' ? 'BSC Mainnet' : 
                 chainId === '0x61' ? 'BSC Testnet' : 
                 `Chain ${chainId}`}
              </p>
            </div>
            {chainId !== '0x38' && (
              <button
                onClick={() => switchNetwork('0x38')}
                className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                {t('wallet.switch_network')}
              </button>
            )}
          </div>

          {/* 余额 */}
          {showBalance && (
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('wallet.balance')}
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatBalance(balance)} BNB
              </p>
            </div>
          )}

          {/* 连接状态 */}
          {isRecordingConnection && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {t('wallet.recording_connection')}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* 连接按钮 */}
      <button
        onClick={() => setShowModal(true)}
        disabled={isConnecting}
        className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl ${className}`}
      >
        {isConnecting ? t('wallet.connecting') : t('wallet.connect_wallet')}
      </button>

      {/* 错误提示 */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* 钱包选择模态框 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('wallet.select_wallet')}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                {WALLET_PROVIDERS.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => handleWalletConnect(provider.id)}
                    disabled={isConnecting}
                    className="w-full flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <span className="text-2xl mr-3">{provider.icon}</span>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {provider.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {provider.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('wallet.connection_secure')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 