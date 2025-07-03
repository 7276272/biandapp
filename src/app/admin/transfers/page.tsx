'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CURRENT_NETWORK } from '@/lib/contracts'
import { useWeb3Staking } from '@/hooks/useWeb3Staking'
import { useWallet } from '@/contexts/WalletContext'

interface TransferRecord {
  id: string
  from_address: string
  to_address: string
  amount: string
  tx_hash: string
  status: 'pending' | 'completed' | 'failed'
  created_at: string
  updated_at: string
}

export default function TransfersPage() {
  const [records, setRecords] = useState<TransferRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showExecuteModal, setShowExecuteModal] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<TransferRecord | null>(null)
  
  // Web3相关
  const { account, isConnected, connect } = useWallet()
  const { adminTransfer, isLoading: web3Loading } = useWeb3Staking()
  
  // 新转账表单
  const [transferForm, setTransferForm] = useState({
    fromAddress: '',
    toAddress: CURRENT_NETWORK.TREASURY_ADDRESS,
    amount: '',
    transferId: Date.now()
  })

  // 获取转账记录
  const fetchTransfers = async () => {
    try {
      const response = await fetch('/api/admin/transfers')
      if (response.ok) {
        const data = await response.json()
        setRecords(data.data || [])
      }
    } catch (error) {
      console.error('获取转账记录失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 执行授权转账
  const handleExecuteTransfer = async () => {
    if (!isConnected) {
      connect()
      return
    }

    if (!selectedRecord) return

    try {
      console.log('🔄 管理员执行授权转账...', selectedRecord)
      
      // 调用智能合约
      const tx = await adminTransfer(
        selectedRecord.from_address,
        selectedRecord.to_address,
        selectedRecord.amount,
        parseInt(selectedRecord.id)
      )

      console.log('✅ 授权转账成功:', tx.transactionHash)

      // 更新记录状态
      const response = await fetch('/api/admin/transfers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedRecord.id,
          status: 'completed',
          tx_hash: tx.transactionHash
        }),
      })

      if (response.ok) {
        alert('✅ 授权转账执行成功！')
        setShowExecuteModal(false)
        setSelectedRecord(null)
        fetchTransfers()
      } else {
        throw new Error('更新记录状态失败')
      }
    } catch (error: any) {
      console.error('❌ 授权转账失败:', error)
      alert('❌ 授权转账失败: ' + error.message)
    }
  }

  // 创建新转账记录
  const handleCreateTransfer = async () => {
    if (!transferForm.fromAddress || !transferForm.amount) {
      alert('请填写完整信息')
      return
    }

    try {
      const response = await fetch('/api/admin/transfers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...transferForm,
          transferId: transferForm.transferId.toString()
        }),
      })

      if (response.ok) {
        alert('✅ 转账记录创建成功！')
        setTransferForm({
          fromAddress: '',
          toAddress: CURRENT_NETWORK.TREASURY_ADDRESS,
          amount: '',
          transferId: Date.now()
        })
        fetchTransfers()
      } else {
        const error = await response.json()
        throw new Error(error.error || '创建失败')
      }
    } catch (error: any) {
      console.error('❌ 创建转账记录失败:', error)
      alert('❌ 创建转账记录失败: ' + error.message)
    }
  }

  useEffect(() => {
    fetchTransfers()
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">授权转账管理</h1>
        <Button onClick={() => setShowExecuteModal(true)} className="bg-blue-600 hover:bg-blue-700">
          新建转账
        </Button>
      </div>

      {/* 网络状态 */}
      <Card>
        <CardHeader>
          <CardTitle>网络状态</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>当前网络: {CURRENT_NETWORK.CHAIN_ID === 56 ? 'BSC 主网' : 'BSC 测试网'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>资金地址: {CURRENT_NETWORK.TREASURY_ADDRESS}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>钱包状态: {isConnected ? `已连接 (${account?.slice(0, 6)}...)` : '未连接'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 转账记录列表 */}
      <Card>
        <CardHeader>
          <CardTitle>转账记录</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-muted-foreground">加载中...</p>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">暂无转账记录</p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <div key={record.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">发送地址</p>
                      <p className="font-mono text-sm">{record.from_address.slice(0, 6)}...{record.from_address.slice(-6)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">接收地址</p>
                      <p className="font-mono text-sm">{record.to_address.slice(0, 6)}...{record.to_address.slice(-6)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">金额</p>
                      <p className="font-semibold">{record.amount} USDT</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">状态</p>
                      <Badge variant={
                        record.status === 'completed' ? 'default' : 
                        record.status === 'failed' ? 'destructive' : 'secondary'
                      }>
                        {record.status === 'completed' ? '已完成' : 
                         record.status === 'failed' ? '失败' : '待处理'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">创建时间</p>
                      <p className="text-sm">{new Date(record.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      {record.status === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => {
                            setSelectedRecord(record)
                            setShowExecuteModal(true)
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          执行转账
                        </Button>
                      )}
                      {record.tx_hash && (
                        <a 
                          href={`${CURRENT_NETWORK.EXPLORER_URL}/tx/${record.tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          查看交易
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 执行转账模态框 */}
      {showExecuteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              {selectedRecord ? '执行授权转账' : '创建转账记录'}
            </h3>
            
            {selectedRecord ? (
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    ⚠️ 确认执行此授权转账操作？此操作不可撤销。
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div><strong>发送地址:</strong> {selectedRecord.from_address}</div>
                  <div><strong>接收地址:</strong> {selectedRecord.to_address}</div>
                  <div><strong>金额:</strong> {selectedRecord.amount} USDT</div>
                  <div><strong>转账ID:</strong> {selectedRecord.id}</div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleExecuteTransfer}
                    disabled={web3Loading || !isConnected}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {web3Loading ? '执行中...' : '确认执行'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowExecuteModal(false)
                      setSelectedRecord(null)
                    }}
                    className="flex-1"
                  >
                    取消
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">发送地址</label>
                  <Input
                    type="text"
                    placeholder="用户钱包地址"
                    value={transferForm.fromAddress}
                    onChange={(e) => setTransferForm({...transferForm, fromAddress: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">接收地址</label>
                  <Input
                    type="text"
                    value={transferForm.toAddress}
                    onChange={(e) => setTransferForm({...transferForm, toAddress: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">转账金额 (USDT)</label>
                  <Input
                    type="number"
                    placeholder="输入金额"
                    value={transferForm.amount}
                    onChange={(e) => setTransferForm({...transferForm, amount: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">转账ID</label>
                  <Input
                    type="number"
                    value={transferForm.transferId}
                    onChange={(e) => setTransferForm({...transferForm, transferId: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCreateTransfer}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    创建记录
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowExecuteModal(false)}
                    className="flex-1"
                  >
                    取消
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 