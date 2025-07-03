'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { WalletConnector } from '@/components/WalletConnector'
import { useWallet } from '@/contexts/WalletContext'
import { useAccount, useBalance, useNetwork } from 'wagmi'
import Link from 'next/link'

export default function WalletPage() {
  const { account, isConnected, balance } = useWallet()
  const { address, chain } = useAccount()
  const { data: balanceData } = useBalance({
    address: address,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">钱包管理</h1>
              <p className="text-gray-600 mt-1">管理您的数字钱包和资产</p>
            </div>
            <Link href="/">
              <Button variant="outline">返回首页</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {!isConnected ? (
          /* 未连接状态 */
          <div className="space-y-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">连接您的钱包</CardTitle>
                <p className="text-gray-600">
                  选择您喜欢的钱包来开始使用 BSC Pool DeFi 平台
                </p>
              </CardHeader>
              <CardContent className="flex justify-center">
                <WalletConnector />
              </CardContent>
            </Card>

            {/* 支持的网络 */}
            <Card>
              <CardHeader>
                <CardTitle>支持的网络</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                      B
                    </div>
                    <div>
                      <div className="font-semibold">Binance Smart Chain</div>
                      <div className="text-sm text-gray-600">BSC Mainnet</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      E
                    </div>
                    <div>
                      <div className="font-semibold">Ethereum</div>
                      <div className="text-sm text-gray-600">ETH Mainnet</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      A
                    </div>
                    <div>
                      <div className="font-semibold">Arbitrum</div>
                      <div className="text-sm text-gray-600">Layer 2</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                      T
                    </div>
                    <div>
                      <div className="font-semibold">BSC Testnet</div>
                      <div className="text-sm text-gray-600">测试网络</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 钱包功能介绍 */}
            <Card>
              <CardHeader>
                <CardTitle>钱包功能</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-600">✅ 支持功能</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        多钱包支持（MetaMask、Trust Wallet等）
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        实时余额查询
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        多网络切换
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        安全交易签名
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-blue-600">🔐 安全特性</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        本地私钥存储
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        交易确认机制
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        钱包连接状态监控
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        自动断线保护
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* 已连接状态 */
          <div className="space-y-6">
            {/* 钱包信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  钱包已连接
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">钱包地址</label>
                      <div className="font-mono text-sm bg-gray-100 p-3 rounded border break-all">
                        {address}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">当前网络</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{chain?.name || 'Unknown'}</Badge>
                        <span className="text-sm text-gray-500">Chain ID: {chain?.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">余额</label>
                      <div className="text-2xl font-bold text-blue-600">
                        {balanceData?.formatted ? 
                          `${Number(balanceData.formatted).toFixed(4)} ${balanceData.symbol}` : 
                          '加载中...'
                        }
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">连接状态</label>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600">已连接</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 钱包操作 */}
            <Card>
              <CardHeader>
                <CardTitle>钱包操作</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-16 flex flex-col items-center gap-2">
                    <span className="text-lg">💰</span>
                    <span>查看余额</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col items-center gap-2">
                    <span className="text-lg">🔄</span>
                    <span>切换网络</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col items-center gap-2">
                    <span className="text-lg">📋</span>
                    <span>复制地址</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 交易历史（模拟） */}
            <Card>
              <CardHeader>
                <CardTitle>最近交易</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">↓</span>
                      </div>
                      <div>
                        <div className="font-semibold">接收</div>
                        <div className="text-sm text-gray-600">2024-01-15 14:30</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">+100.00 USDT</div>
                      <div className="text-sm text-gray-600">已确认</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm">⚡</span>
                      </div>
                      <div>
                        <div className="font-semibold">质押</div>
                        <div className="text-sm text-gray-600">2024-01-14 10:15</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-blue-600">500.00 USDT</div>
                      <div className="text-sm text-gray-600">进行中</div>
                    </div>
                  </div>

                  <div className="text-center py-4">
                    <Button variant="outline" size="sm">查看更多交易</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 