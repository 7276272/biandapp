import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { env } from './env'

// API Base URL - 连接到后端数据库
const API_BASE_URL = env.API_BASE_URL

// API响应类型
interface ApiResponse<T = any> {
  code: number
  msg: string
  time: number
  data: T
}

// Types
export interface CryptoPriceData {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap: number
  volume: number
  high_24h: number
  low_24h: number
  last_updated: string
}

export interface MiningStats {
  hashRate: number
  difficulty: number
  blockTime: number
  networkHashRate: string
  nextDifficultyEstimate: number
  blocksUntilDifficultyChange: number
}

export interface PoolStats {
  totalHashRate: string
  totalMiners: number
  totalRewards: number
  efficiency: number
  uptime: number
}

export interface UserProfile {
  id: string
  address: string
  balance: number
  mining_power: number
  total_rewards: number
  referral_count: number
  created_at: string
  updated_at: string
}

export interface MiningReward {
  id: string
  user_id: string
  amount: number
  currency: string
  timestamp: string
  status: 'pending' | 'confirmed' | 'failed'
  transaction_hash?: string
}

export interface Transaction {
  id: string
  user_id: string
  type: 'deposit' | 'withdrawal' | 'mining_reward' | 'referral_bonus'
  amount: number
  currency: string
  status: 'pending' | 'confirmed' | 'failed'
  created_at: string
  updated_at: string
}

// 用户信息类型
interface UserInfo {
  id: number
  name: string
  nickname: string
  addresstrx: string
  addresseth: string
  level_id: number
  money: number
  balance_money: string
  allowance_money: string
  recommend_count: number
  valid_recommend_count: number
  community_count: number
  valid_community_count: number
  status: number
  create_time: number
  login_time: number
  wallet_type?: string
  last_chain_id?: string
}

// 文章类型
interface Article {
  id: number
  title: string
  content: string
  readtimes: number
  user_read_times: number
  create_time: number
  isad: number
  status: number
}

// 任务/质押记录类型
interface Task {
  id: number
  user_name: string
  amount: number
  status: number
  start_time: number
  end_time: number
  reward_amount: number
  create_time: number
  addtype: number
}

// 收益记录类型
interface Reward {
  id: number
  user_name: string
  amount: number
  reward_type: number
  remark: string
  create_time: number
}

// 提现记录类型
interface Withdraw {
  id: number
  user_name: string
  amount: number
  fee: number
  actual_amount: number
  address: string
  status: number
  create_time: number
  process_time: number
  tx_hash: string
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

        // 添加通用参数
        const params = {
          address: this.userAddress,
          language: this.getCurrentLanguage(),
          timestamp: Date.now(),
          ...(config.params || {})
        }

        // 对于 GET 请求，参数放在 URL 中
        if (config.method === 'get') {
          const urlParams = new URLSearchParams()
          Object.entries(params).forEach(([key, value]) => {
            if (value !== '' && value !== null && value !== undefined) {
              urlParams.append(key, String(value))
            }
          })
          
          const separator = config.url?.includes('?') ? '&' : '?'
          config.url += separator + urlParams.toString()
        } else {
          // 对于 POST 请求，参数放在 body 中
          config.data = { ...params, ...(config.data || {}) }
        }

        console.log('🔄 API请求:', {
          method: config.method,
          url: config.url,
          params: config.method === 'get' ? params : undefined,
          data: config.method === 'post' ? config.data : undefined
        })

        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        const { data } = response
        console.log('✅ API响应:', {
          url: response.config.url,
          status: response.status,
          data: data
        })

        // 如果是成功响应，返回数据
        if (data.code === 1 || data.code === 0) {
          return response
        }

        // 处理业务错误
        const errorMessage = data.msg || '请求失败'
        throw new Error(errorMessage)
      },
      (error: AxiosError) => {
        console.error('❌ API错误:', error)
        
        let errorMessage = '网络请求失败'
        
        if (error.response) {
          const { status } = error.response
          if (status === 404) {
            errorMessage = 'API接口不存在'
          } else if (status === 500) {
            errorMessage = '服务器内部错误'
          } else if (status >= 400) {
            errorMessage = (error.response.data as any)?.msg || `请求错误 (${status})`
          }
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = '请求超时'
        } else if (error.message.includes('Network Error')) {
          errorMessage = '网络连接失败'
        }

        return Promise.reject(new Error(errorMessage))
      }
    )
  }

  private getCurrentLanguage(): string {
    if (typeof window === 'undefined') return env.DEFAULT_LANGUAGE
    return localStorage.getItem('language') || env.DEFAULT_LANGUAGE
  }

  // 设置用户地址
  setUserAddress(address: string) {
    this.userAddress = address
    if (typeof window !== 'undefined') {
      localStorage.setItem('wallet_address', address)
    }
  }

  // 获取用户信息
  async fetchUserInfo(address?: string): Promise<UserInfo> {
    const params = address ? { address } : {}
    const response = await this.instance.get<ApiResponse<UserInfo>>(env.API_PATHS.USER_INFO, { params })
    return response.data.data
  }

  // 绑定/创建用户
  async bindUser(params: { address: string; referrer?: string }): Promise<UserInfo> {
    const data = { address: params.address, inviter: params.referrer || '' }
    const response = await this.instance.post<ApiResponse<UserInfo>>(env.API_PATHS.USER_BIND, data)
    return response.data.data
  }

  // 钱包连接记录
  async recordWalletConnect(connectData: {
    address: string
    chainId?: number
    timestamp?: number
  }): Promise<any> {
    const data = {
      address: connectData.address,
      timestamp: connectData.timestamp || Date.now(),
      chainId: connectData.chainId || 1,
      platform: 'web',
      device_model: navigator.userAgent,
      connect_type: 'wallet_connect'
    }
    const response = await this.instance.post<ApiResponse>(env.API_PATHS.WALLET_CONNECT, data)
    return response.data.data
  }

  // 获取文章列表
  async fetchArticles(): Promise<Article[]> {
    const response = await this.instance.get<ApiResponse<Article[]>>(env.API_PATHS.ARTICLES)
    return response.data.data || []
  }

  // 获取文章详情
  async fetchArticleDetail(articleId: number): Promise<Article> {
    const params = { articles_id: articleId }
    const response = await this.instance.get<ApiResponse<Article>>(env.API_PATHS.ARTICLE_DETAIL, { params })
    return response.data.data
  }

  // 获取收益列表
  async fetchRewardList(page: number = 1, pagesize: number = 10): Promise<Reward[]> {
    const params = { page, pagesize }
    const response = await this.instance.get<ApiResponse<Reward[]>>(env.API_PATHS.REWARD_LIST, { params })
    return response.data.data || []
  }

  // 获取任务列表
  async fetchTasksList(page: number = 1, pagesize: number = 10): Promise<Task[]> {
    const params = { page, pagesize }
    const response = await this.instance.get<ApiResponse<Task[]>>(env.API_PATHS.TASKS_LIST, { params })
    return response.data.data || []
  }

  // 获取质押列表
  async fetchPledgeList(page: number = 1, pagesize: number = 10): Promise<Task[]> {
    const params = { page, pagesize }
    const response = await this.instance.get<ApiResponse<Task[]>>(env.API_PATHS.PLEDGE_LIST, { params })
    return response.data.data || []
  }

  // 获取提现列表
  async fetchWithdrawList(page: number = 1, pagesize: number = 10): Promise<Withdraw[]> {
    const params = { page, pagesize }
    const response = await this.instance.get<ApiResponse<Withdraw[]>>(env.API_PATHS.WITHDRAW_LIST, { params })
    return response.data.data || []
  }

  // 提现申请
  async submitWithdraw(amount: number, address: string, password?: string): Promise<any> {
    const data = { amount, address, password }
    const response = await this.instance.post<ApiResponse>(env.API_PATHS.WITHDRAW, data)
    return response.data.data
  }

  // 获取邀请列表
  async fetchInviteList(page: number = 1, pagesize: number = 10): Promise<any[]> {
    const params = { page, pagesize }
    const response = await this.instance.get<ApiResponse<any[]>>(env.API_PATHS.INVITE_LIST, { params })
    return response.data.data || []
  }

  // 获取云矿池配置
  async fetchYunPoolConfig(): Promise<any> {
    const response = await this.instance.get<ApiResponse>(env.API_PATHS.YUN_POOL)
    return response.data.data
  }

  // 获取统计数据
  async fetchStatistics(): Promise<any> {
    const response = await this.instance.get<ApiResponse>(env.API_PATHS.STATISTICS)
    return response.data.data
  }

  // 获取货币配置
  async fetchCurrencyConfig(): Promise<any> {
    const response = await this.instance.get<ApiResponse>(env.API_PATHS.CURRENCY)
    return response.data.data
  }

  // 获取登录日志
  async fetchLoginList(page: number = 1, pagesize: number = 10): Promise<any[]> {
    const params = { page, pagesize }
    const response = await this.instance.get<ApiResponse<any[]>>(env.API_PATHS.LOGIN_LIST, { params })
    return response.data.data || []
  }

  // 获取签名
  async getSign(data: any): Promise<string> {
    const response = await this.instance.post<ApiResponse<string>>(env.API_PATHS.GET_SIGN, data)
    return response.data.data
  }

  // 兼容旧接口的方法
  async fetchUserProfile(address: string): Promise<UserInfo> {
    return this.fetchUserInfo(address)
  }

  async createUserProfile(profileData: any): Promise<UserInfo> {
    return this.bindUser({ address: profileData.address, referrer: profileData.inviter })
  }

  async updateUserProfile(profileData: any): Promise<UserInfo> {
    // 更新用户信息的接口（如果后端有提供）
    throw new Error('用户信息更新接口需要后端支持')
  }

  async fetchTransactionHistory(page: number = 1, pagesize: number = 10): Promise<any[]> {
    // 交易历史可以通过任务列表获取
    return this.fetchTasksList(page, pagesize)
  }

  async fetchUserBalance(address: string): Promise<any> {
    const userInfo = await this.fetchUserInfo(address)
    return {
      balance: userInfo.balance_money,
      allowance: userInfo.allowance_money,
      total_investment: userInfo.money
    }
  }

  async fetchUserMiningStats(address: string): Promise<any> {
    const userInfo = await this.fetchUserInfo(address)
    return {
      total_mining: userInfo.money,
      active_mining: userInfo.balance_money,
      mining_count: userInfo.recommend_count
    }
  }
}

// 创建ApiClient实例
const apiClient = new ApiClient()

// 默认导出ApiClient实例
export default apiClient
// 同时导出类，以便需要时创建新实例
export { ApiClient }

// 导出类型
export type {
  ApiResponse,
  UserInfo,
  Article,
  Task,
  Reward,
  Withdraw
}
