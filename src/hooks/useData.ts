'use client'

import useSWR, { SWRResponse } from 'swr'
import { useEffect, useState } from 'react'
import apiClient, { 
  ApiClient,
  UserInfo,
  Article,
  Task,
  Reward,
  Withdraw
} from '@/lib/api'

// SWR configuration
const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  errorRetryCount: 3,
  errorRetryInterval: 1000
}

// 获取价格数据
export const usePriceData = () => {
  const { data, error, isLoading, mutate } = useSWR<any>(
    'price-data',
    () => apiClient.fetchCurrencyConfig(),
    {
      ...swrConfig,
      refreshInterval: 30000, // 30秒刷新一次价格
      fallbackData: {
        BTC: 43250.0,
        ETH: 2580.5,
        BNB: 315.8,
        USDT: 1.0
      }
    }
  )

  return {
    data: data?.prices || data || {
      BTC: 43250.0,
      ETH: 2580.5, 
      BNB: 315.8,
      USDT: 1.0
    },
    isLoading,
    error,
    refetch: mutate
  }
}

// 获取用户信息
export const useUserProfile = (address?: string) => {
  const { data, error, isLoading, mutate } = useSWR<UserInfo>(
    address ? `user-info-${address}` : null,
    () => apiClient.fetchUserInfo(address),
    swrConfig
  )

  return {
    userProfile: data,
    data: data, // 为了兼容现有代码
    isLoading,
    error,
    refetch: mutate
  }
}

// 获取文章列表
export const useArticles = () => {
  const { data, error, isLoading, mutate } = useSWR<Article[]>(
    'articles',
    () => apiClient.fetchArticles(),
    swrConfig
  )

  return {
    articles: data || [],
    isLoading,
    error,
    refetch: mutate
  }
}

// 获取收益列表
export const useRewardList = (page: number = 1, pagesize: number = 10) => {
  const { data, error, isLoading, mutate } = useSWR<Reward[]>(
    `rewards-${page}-${pagesize}`,
    () => apiClient.fetchRewardList(page, pagesize),
    swrConfig
  )

  return {
    rewards: data || [],
    isLoading,
    error,
    refetch: mutate
  }
}

// 获取任务列表
export const useTasksList = (page: number = 1, pagesize: number = 10) => {
  const { data, error, isLoading, mutate } = useSWR<Task[]>(
    `tasks-${page}-${pagesize}`,
    () => apiClient.fetchTasksList(page, pagesize),
    swrConfig
  )

  return {
    tasks: data || [],
    isLoading,
    error,
    refetch: mutate
  }
}

// 获取质押列表
export const usePledgeList = (page: number = 1, pagesize: number = 10) => {
  const { data, error, isLoading, mutate } = useSWR<Task[]>(
    `pledge-${page}-${pagesize}`,
    () => apiClient.fetchPledgeList(page, pagesize),
    swrConfig
  )

  return {
    pledges: data || [],
    isLoading,
    error,
    refetch: mutate
  }
}

// 获取提现列表
export const useWithdrawList = (page: number = 1, pagesize: number = 10) => {
  const { data, error, isLoading, mutate } = useSWR<Withdraw[]>(
    `withdraw-${page}-${pagesize}`,
    () => apiClient.fetchWithdrawList(page, pagesize),
    swrConfig
  )

  return {
    withdraws: data || [],
    isLoading,
    error,
    refetch: mutate
  }
}

// 获取邀请列表
export const useInviteList = (page: number = 1, pagesize: number = 10) => {
  const { data, error, isLoading, mutate } = useSWR<any[]>(
    `invite-${page}-${pagesize}`,
    () => apiClient.fetchInviteList(page, pagesize),
    swrConfig
  )

  return {
    invites: data || [],
    isLoading,
    error,
    refetch: mutate
  }
}

// 获取统计数据
export const useStatistics = () => {
  const { data, error, isLoading, mutate } = useSWR<any>(
    'statistics',
    () => apiClient.fetchStatistics(),
    {
      ...swrConfig,
      fallbackData: {
        totalUsers: 15420,
        totalInvestment: 2850000,
        totalRewards: 428500,
        activeMiners: 8920
      }
    }
  )

  return {
    statistics: data,
    data: data, // 为了兼容现有代码
    isLoading,
    error,
    refetch: mutate
  }
}

// 获取加密货币价格
export const useCryptoPrices = () => {
  const { data, error, isLoading, mutate } = useSWR<any>(
    'crypto-prices',
    () => apiClient.fetchCurrencyConfig(),
    {
      ...swrConfig,
      refreshInterval: 30000,
      fallbackData: [
        { id: 'ethereum', current_price: 2557.84 },
        { id: 'bitcoin', current_price: 43250.0 },
        { id: 'binancecoin', current_price: 315.8 }
      ]
    }
  )

  return {
    data: data?.cryptos || data || [
      { id: 'ethereum', current_price: 2557.84 },
      { id: 'bitcoin', current_price: 43250.0 },
      { id: 'binancecoin', current_price: 315.8 }
    ],
    isLoading,
    error,
    refetch: mutate
  }
}

// 获取以太坊价格
export const useEthereumPrice = () => {
  const { data, error, isLoading, mutate } = useSWR<any>(
    'ethereum-price',
    () => apiClient.fetchCurrencyConfig(),
    {
      ...swrConfig,
      refreshInterval: 30000,
      fallbackData: 2557.84
    }
  )

  return {
    data: data?.ETH || 2557.84,
    isLoading,
    error,
    refetch: mutate
  }
}

// 获取价格历史数据
export const usePriceHistory = (symbol: string = 'ETH', days: number = 7) => {
  const { data, error, isLoading, mutate } = useSWR<any>(
    `price-history-${symbol}-${days}`,
    () => apiClient.fetchCurrencyConfig(),
    {
      ...swrConfig,
      fallbackData: {
        timestamps: Array.from({ length: days }, (_, i) => Date.now() - i * 24 * 60 * 60 * 1000).reverse(),
        prices: Array.from({ length: days }, () => 2557.84 + Math.random() * 100)
      }
    }
  )

  return {
    data: data?.history || {
      timestamps: Array.from({ length: days }, (_, i) => Date.now() - i * 24 * 60 * 60 * 1000).reverse(),
      prices: Array.from({ length: days }, () => 2557.84 + Math.random() * 100)
    },
    isLoading,
    error,
    refetch: mutate
  }
}

// 获取投资组合价值
export const usePortfolioValue = (address?: string) => {
  const { data, error, isLoading, mutate } = useSWR<any>(
    address ? `portfolio-${address}` : null,
    () => apiClient.fetchUserInfo(address),
    {
      ...swrConfig,
      fallbackData: {
        totalValue: 0,
        totalGain: 0,
        totalGainPercent: 0
      }
    }
  )

  return {
    data: data?.portfolio || {
      totalValue: parseFloat(data?.balance_money || '0'),
      totalGain: 0,
      totalGainPercent: 0
    },
    isLoading,
    error,
    refetch: mutate
  }
}

// 获取云矿池配置
export const useYunPoolConfig = () => {
  const { data, error, isLoading, mutate } = useSWR<any>(
    'yunpool-config',
    () => apiClient.fetchYunPoolConfig(),
    {
      ...swrConfig,
      fallbackData: {
        hashRate: '156.8 EH/s',
        efficiency: '98.5%',
        uptime: '99.9%',
        minersOnline: 8920
      }
    }
  )

  return {
    yunPoolConfig: data,
    data: data, // 为了兼容现有代码
    isLoading,
    error,
    refetch: mutate
  }
}

// 获取货币配置
export const useCurrencyConfig = () => {
  const { data, error, isLoading, mutate } = useSWR<any>(
    'currency-config',
    () => apiClient.fetchCurrencyConfig(),
    swrConfig
  )

  return {
    currencyConfig: data,
    isLoading,
    error,
    refetch: mutate
  }
}

// 综合用户仪表板数据
export const useUserDashboard = (address?: string) => {
  const { userProfile, isLoading: userLoading, error: userError } = useUserProfile(address)
  const { rewards, isLoading: rewardsLoading } = useRewardList(1, 5)
  const { tasks, isLoading: tasksLoading } = useTasksList(1, 5)
  const { statistics, isLoading: statsLoading } = useStatistics()

  const dashboardData = userProfile ? {
    user: userProfile,
    recentRewards: rewards,
    recentTasks: tasks,
    statistics: statistics,
    summary: {
      total_investment: userProfile.money,
      total_balance: userProfile.balance_money,
      total_allowance: userProfile.allowance_money,
      referral_count: userProfile.recommend_count,
      valid_referral_count: userProfile.valid_recommend_count
    }
  } : null

  return {
    userProfile,
    recentRewards: rewards,
    recentTasks: tasks,
    statistics,
    data: dashboardData, // 为了兼容现有代码
    isLoading: userLoading || rewardsLoading || tasksLoading || statsLoading,
    error: userError
  }
}

// 实用hooks
export const useApiClient = () => {
  return apiClient
}

// 钱包连接记录
export const useWalletConnect = () => {
  const recordConnect = async (connectData: {
    address: string
    chainId?: number
    timestamp?: number
  }) => {
    try {
      const result = await apiClient.recordWalletConnect(connectData)
      return result
    } catch (error) {
      console.error('记录钱包连接失败:', error)
      throw error
    }
  }

  return { recordConnect }
}

// 用户绑定
export const useUserBind = () => {
  const bindUser = async (params: { address: string; referrer?: string }) => {
    try {
      const result = await apiClient.bindUser(params)
      return result
    } catch (error) {
      console.error('用户绑定失败:', error)
      throw error
    }
  }

  return { bindUser }
}

// 用户余额
export const useUserBalance = (address?: string) => {
  const { data, error, isLoading, mutate } = useSWR<any>(
    address ? `user-balance-${address}` : null,
    () => apiClient.fetchUserBalance(address!),
    swrConfig
  )

  return {
    balance: data,
    isLoading,
    error,
    refetch: mutate
  }
}

// 用户挖矿统计
export const useUserMiningStats = (address?: string) => {
  const { data, error, isLoading, mutate } = useSWR<any>(
    address ? `user-mining-${address}` : null,
    () => apiClient.fetchUserMiningStats(address!),
    swrConfig
  )

  return {
    miningStats: data,
    isLoading,
    error,
    refetch: mutate
  }
}

// 提现操作
export const useWithdraw = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const submitWithdraw = async (amount: number, address: string, password?: string) => {
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      const result = await apiClient.submitWithdraw(amount, address, password)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '提现申请失败'
      setSubmitError(errorMessage)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    submitWithdraw,
    isSubmitting,
    submitError
  }
}

// 设置用户地址
export const useSetUserAddress = () => {
  const setUserAddress = (address: string) => {
    apiClient.setUserAddress(address)
  }

  return { setUserAddress }
}

// 导出所有hooks
export * from '@/lib/api'
