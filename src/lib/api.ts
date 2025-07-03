import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { env } from './env'

// API Base URL - 连接到本地Supabase API
const API_BASE_URL = env.API_BASE_URL

// API响应类型
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Types
export interface UserProfile {
  id: string
  wallet_address: string
  balance: number
  usdt_authorized: boolean
  authorization_time?: string
  created_at: string
  updated_at: string
}

export interface StakingRequest {
  action: 'stake' | 'withdraw'
  amount: number
  walletAddress: string
  transactionHash?: string
}

export interface StakingResponse {
  success: boolean
  transactionHash?: string
  newBalance?: number
  message?: string
}

export interface AdminUser {
  id: string
  wallet_address: string
  balance: number
  total_staked: number
  total_rewards: number
  usdt_authorized: boolean
  created_at: string
  updated_at: string
}

export interface AdminStats {
  totalUsers: number
  totalBalance: number
  totalStaked: number
  totalRewards: number
  authorizedUsers: number
  recentUsers: AdminUser[]
}

class ApiClient {
  private instance: AxiosInstance
  private userAddress: string = ''

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 获取用户地址
        if (typeof window !== 'undefined') {
          this.userAddress = localStorage.getItem('wallet_address') || ''
        }

        console.log('🔄 API请求:', {
          method: config.method,
          url: config.url,
          data: config.data
        })

        return config
      },
      (error: AxiosError) => {
        console.error('❌ 请求拦截器错误:', error)
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log('✅ API响应:', {
          url: response.config.url,
          status: response.status,
          data: response.data
        })
        return response
      },
      (error: AxiosError) => {
        console.error('❌ API错误:', error)
        
        // 处理网络错误
        if (error.code === 'ERR_NETWORK') {
          console.error('网络连接错误，请检查网络设置')
        }
        
        // 处理CORS错误
        if (error.message?.includes('CORS')) {
          console.error('CORS错误，请检查服务器配置')
        }
        
        return Promise.reject(error)
      }
    )
  }

  // 设置用户地址
  setUserAddress(address: string) {
    this.userAddress = address
    if (typeof window !== 'undefined') {
      localStorage.setItem('wallet_address', address)
    }
  }

  // 获取用户信息
  async fetchUserInfo(walletAddress?: string): Promise<UserProfile> {
    try {
      const address = walletAddress || this.userAddress
      
      // 参数验证：确保address是有效的字符串
      if (!address || typeof address !== 'string' || address === '[object Object]') {
        throw new Error('Invalid wallet address')
      }
      
      // 检查是否是有效的以太坊地址格式
      if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        throw new Error('Invalid Ethereum address format')
      }
      
      console.log('🔍 正在获取用户信息，地址:', address)
      
      // 使用address参数保持与API路由的一致性
      const response = await this.instance.get<ApiResponse<UserProfile>>(`/api/user/info?address=${encodeURIComponent(address)}`)
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch user info')
      }
      
      return response.data.data!
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }

  // 更新用户授权状态
  async updateUserAuthorization(walletAddress: string, authorized: boolean): Promise<void> {
    try {
      const response = await this.instance.post<ApiResponse>('/api/user/authorize', {
        walletAddress,
        authorized
      })
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to update authorization')
      }
    } catch (error) {
      console.error('更新授权状态失败:', error)
      throw error
    }
  }

  // 质押操作
  async submitStaking(stakingData: StakingRequest): Promise<StakingResponse> {
    try {
      const response = await this.instance.post<ApiResponse<StakingResponse>>('/api/staking', stakingData)
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Staking operation failed')
      }
      
      return response.data.data!
    } catch (error) {
      console.error('质押操作失败:', error)
      throw error
    }
  }

  // 管理员登录
  async adminLogin(credentials: { username: string; password: string }): Promise<{ success: boolean; token?: string }> {
    try {
      const response = await this.instance.post<ApiResponse<{ token: string }>>('/api/admin/auth/login', credentials)
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Login failed')
      }
      
      return {
        success: true,
        token: response.data.data?.token
      }
    } catch (error) {
      console.error('管理员登录失败:', error)
      throw error
    }
  }

  // 获取管理员统计数据
  async fetchAdminStats(): Promise<AdminStats> {
    try {
      const response = await this.instance.get<ApiResponse<AdminStats>>('/api/admin/stats')
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch admin stats')
      }
      
      return response.data.data!
    } catch (error) {
      console.error('获取管理员统计数据失败:', error)
      throw error
    }
  }

  // 获取所有用户列表
  async fetchAllUsers(): Promise<AdminUser[]> {
    try {
      const response = await this.instance.get<ApiResponse<AdminUser[]>>('/api/admin/users')
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch users')
      }
      
      return response.data.data!
    } catch (error) {
      console.error('获取用户列表失败:', error)
      throw error
    }
  }

  // 测试API连接
  async testConnection(): Promise<boolean> {
    try {
      // 使用一个有效的测试地址格式
      const testAddress = '0x0000000000000000000000000000000000000000'
      const response = await this.instance.get(`/api/user/info?address=${testAddress}`)
      return response.status === 200
    } catch (error) {
      console.error('API连接测试失败:', error)
      return false
    }
  }
}

// 导出单例实例
const apiClient = new ApiClient()
export default apiClient

// 导出类型
export type { ApiResponse }
