'use client'

import { useAppKit } from '@reown/appkit/react'
import { useAccount, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import apiClient from '@/lib/api'
import { useEffect, useState } from 'react'

export function WalletConnector() {
  const { open } = useAppKit()
  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const [isRecording, setIsRecording] = useState(false)

  // 当钱包连接时，记录连接信息到后端
  useEffect(() => {
    if (isConnected && address && !isRecording) {
      recordWalletConnection()
    }
  }, [isConnected, address])

  const recordWalletConnection = async () => {
    if (!address) return
    
    setIsRecording(true)
    try {
      // 记录钱包连接到后端
      await apiClient.recordWalletConnect({
        address,
        chainId: chain?.id || 1,
        timestamp: Date.now()
      })

      // 尝试绑定/创建用户
      await apiClient.bindUser({
        address,
        referrer: '', // 可以从 URL 参数获取推荐人
      })
      
      console.log('钱包连接已记录到后端')
    } catch (error) {
      console.error('记录钱包连接失败:', error)
    } finally {
      setIsRecording(false)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">钱包已连接</span>
              </div>
              <Badge className="border border-gray-300 text-gray-700">
                {chain?.name || 'Unknown'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-gray-600">钱包地址:</div>
              <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                {formatAddress(address)}
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                onClick={() => open()}
              >
                切换钱包
              </Button>
              <Button 
                className="flex-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                onClick={() => disconnect()}
              >
                断开连接
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Button 
        onClick={() => open()} 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
      >
        🔗 连接钱包
      </Button>
      
      <Card className="w-full max-w-md">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <div className="text-sm text-gray-600">支持的钱包</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                MetaMask
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                WalletConnect
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Trust Wallet
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Coinbase
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// 简化的状态显示组件
export function WalletStatus() {
  const { address, isConnected, chain } = useAccount()
  const { open } = useAppKit()

  if (isConnected && address) {
    return (
      <Button 
        onClick={() => open()}
        className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 border"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>{address.slice(0, 6)}...{address.slice(-4)}</span>
        </div>
      </Button>
    )
  }

  return (
    <Button onClick={() => open()} className="bg-blue-600 hover:bg-blue-700 text-white">
      连接钱包
    </Button>
  )
}
