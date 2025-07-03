'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  Search, 
  Filter,
  ArrowLeft,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { getAdminSession } from '@/lib/auth'

interface User {
  id: number
  address: string
  email?: string
  username?: string
  status: number
  balance: number
  create_time: string
  last_login_time?: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 10
  const router = useRouter()

  useEffect(() => {
    // 检查登录状态
    const session = getAdminSession()
    if (!session) {
      router.push('/admin/login')
      return
    }
    fetchUsers()
  }, [router, currentPage])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const offset = (currentPage - 1) * pageSize
      const response = await fetch(`/api/admin/users?offset=${offset}&limit=${pageSize}&search=${searchTerm}`)
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.users)
        setTotalPages(Math.ceil(data.total / pageSize))
      }
    } catch (error) {
      console.error('获取用户列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchUsers()
  }

  const handleStatusChange = async (userId: number, newStatus: number) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('更新用户状态失败:', error)
    }
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

  const truncateAddress = (address: string) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/admin/dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回
              </Button>
              <Users className="h-6 w-6 text-red-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                用户管理
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>搜索和筛选</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="搜索用户地址或邮箱..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                搜索
              </Button>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                筛选
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>用户列表 ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">用户ID</th>
                        <th className="text-left py-3 px-4">钱包地址</th>
                        <th className="text-left py-3 px-4">邮箱</th>
                        <th className="text-left py-3 px-4">余额</th>
                        <th className="text-left py-3 px-4">状态</th>
                        <th className="text-left py-3 px-4">注册时间</th>
                        <th className="text-left py-3 px-4">最后登录</th>
                        <th className="text-left py-3 px-4">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3 px-4">#{user.id}</td>
                          <td className="py-3 px-4 font-mono text-sm">
                            {truncateAddress(user.address)}
                          </td>
                          <td className="py-3 px-4">{user.email || '-'}</td>
                          <td className="py-3 px-4">${user.balance.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant={user.status === 1 ? 'default' : 'secondary'}
                              className={user.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                            >
                              {user.status === 1 ? '正常' : '禁用'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {formatDate(user.create_time)}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {user.last_login_time ? formatDate(user.last_login_time) : '-'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleStatusChange(user.id, user.status === 1 ? 0 : 1)}
                              >
                                {user.status === 1 ? '禁用' : '启用'}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    页面 {currentPage} / {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      上一页
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      下一页
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 