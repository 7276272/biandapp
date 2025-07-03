'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'
import { getAdminSession } from '@/lib/auth'

interface FinanceStats {
  totalBalance: number
  totalDeposits: number
  totalWithdrawals: number
  pendingTransactions: number
  todayRevenue: number
  monthlyRevenue: number
}

interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'staking' | 'reward'
  amount: number
  address: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
  txHash?: string
  description: string
}

export default function AdminFinancePage() {
  const [adminSession, setAdminSession] = useState<any>(null)
  const [stats, setStats] = useState<FinanceStats>({
    totalBalance: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    pendingTransactions: 0,
    todayRevenue: 0,
    monthlyRevenue: 0
  })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const router = useRouter()

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      const session = await getAdminSession()
      if (!session) {
        router.push('/admin/login')
        return
      }
      setAdminSession(session)
      await fetchFinanceData()
    } catch (error) {
      console.error('管理员认证失败:', error)
      router.push('/admin/login')
    }
  }

  const fetchFinanceData = async () => {
    try {
      setLoading(true)
      
      // 获取财务统计数据
      const statsResponse = await fetch('/api/admin/finance/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        if (statsData.success && statsData.data) {
          setStats(statsData.data)
        }
      }

      // 获取交易记录
      const transactionsResponse = await fetch('/api/admin/finance/transactions')
      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json()
        if (transactionsData.success && transactionsData.data) {
          setTransactions(transactionsData.data)
        }
      }
    } catch (error) {
      console.error('获取财务数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true
    if (filter === 'pending') return tx.status === 'pending'
    if (filter === 'completed') return tx.status === 'completed'
    return true
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownRight className="h-4 w-4 text-green-600" />
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4 text-red-600" />
      case 'staking':
        return <TrendingUp className="h-4 w-4 text-blue-600" />
      case 'reward':
        return <DollarSign className="h-4 w-4 text-purple-600" />
      default:
        return null
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-6 space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">财务管理</h1>
          <div className="flex space-x-2">
            <Button onClick={fetchFinanceData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              刷新
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              导出
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">总余额</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatAmount(stats.totalBalance)}
              </div>
              <p className="text-xs text-green-600">+2.5% 较上月</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">总存款</CardTitle>
              <ArrowDownRight className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatAmount(stats.totalDeposits)}
              </div>
              <p className="text-xs text-blue-600">+12.3% 较上月</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">总提现</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatAmount(stats.totalWithdrawals)}
              </div>
              <p className="text-xs text-orange-600">+8.7% 较上月</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">待处理交易</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.pendingTransactions}
              </div>
              <p className="text-xs text-yellow-600">需要审核</p>
            </CardContent>
          </Card>
        </div>

        {/* 交易记录 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">交易记录</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                  size="sm"
                >
                  全部
                </Button>
                <Button
                  variant={filter === 'pending' ? 'default' : 'outline'}
                  onClick={() => setFilter('pending')}
                  size="sm"
                >
                  待处理
                </Button>
                <Button
                  variant={filter === 'completed' ? 'default' : 'outline'}
                  onClick={() => setFilter('completed')}
                  size="sm"
                >
                  已完成
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">暂无交易记录</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">类型</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">金额</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">地址</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">状态</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">时间</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">描述</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(transaction.type)}
                            <span className="capitalize font-medium text-gray-900 dark:text-white">
                              {transaction.type === 'deposit' ? '充值' : 
                               transaction.type === 'withdrawal' ? '提现' : 
                               transaction.type === 'staking' ? '质押' : '奖励'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${
                            transaction.type === 'deposit' || transaction.type === 'reward' 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {transaction.type === 'deposit' || transaction.type === 'reward' ? '+' : '-'}
                            {formatAmount(transaction.amount)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
                            {transaction.address.slice(0, 6)}...{transaction.address.slice(-4)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(transaction.status)}
                            <Badge 
                              variant={
                                transaction.status === 'completed' ? 'default' : 
                                transaction.status === 'pending' ? 'secondary' : 'destructive'
                              }
                            >
                              {transaction.status === 'completed' ? '已完成' : 
                               transaction.status === 'pending' ? '待处理' : '失败'}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(transaction.createdAt)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {transaction.description}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 