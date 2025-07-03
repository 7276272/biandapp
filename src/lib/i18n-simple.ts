// 简化的国际化配置
export type Language = 'zh' | 'en'

export interface TranslationContent {
  // 通用
  loading: string
  error: string
  success: string
  confirm: string
  cancel: string
  submit: string
  back: string
  next: string
  retry: string
  
  // 导航
  dashboard: string
  mining: string
  wallet: string
  swap: string
  referral: string
  settings: string
  
  // 钱包
  connectWallet: string
  disconnectWallet: string
  walletConnected: string
  walletDisconnected: string
  balance: string
  address: string
  
  // 挖矿
  startMining: string
  stopMining: string
  miningStatus: string
  hashRate: string
  totalRewards: string
  pendingRewards: string
  confirmedRewards: string
  miningDuration: string
  
  // 交易
  transactions: string
  transactionHistory: string
  deposit: string
  withdrawal: string
  amount: string
  currency: string
  status: string
  pending: string
  confirmed: string
  failed: string
  
  // 推荐
  referralCode: string
  referralLink: string
  referralCount: string
  referralRewards: string
  inviteFriends: string
  
  // 兑换
  from: string
  to: string
  exchange: string
  slippage: string
  gasPrice: string
  
  // 统计
  price: string
  change24h: string
  volume: string
  marketCap: string
  high24h: string
  low24h: string
  
  // 设置
  language: string
  theme: string
  notifications: string
  security: string
  about: string
  
  // 消息
  welcomeMessage: string
  miningStarted: string
  miningStopped: string
  transactionSuccess: string
  transactionFailed: string
  walletConnectionFailed: string
  invalidAddress: string
  insufficientBalance: string
  
  // 服务页面
  ourServices: string
  miningPoolServices: string
  miningPoolDescription: string
  secureStaking: string
  secureStakingDescription: string
  defiTrading: string
  defiTradingDescription: string
  groupMining: string
  groupMiningDescription: string
  lowFee: string
  dailyPayouts: string
  uptime: string
  globalServers: string
  noLockupPeriod: string
  insuranceCovered: string
  monitoring24x7: string
  autoTradingBots: string
  lowLatency: string
  advancedCharts: string
  apiAccess: string
  sharedHardware: string
  splitProfits: string
  reducedCosts: string
  groupManagement: string
  getStarted: string
  performanceAnalytics: string
  realTimeAnalytics: string
  realTimeAnalyticsDescription: string
  multiWalletSupport: string
  multiWalletSupportDescription: string
  support24x7: string
  support24x7Description: string
  flexiblePayouts: string
  flexiblePayoutsDescription: string
  activeMiners: string
  dailyVolume: string
  secure: string
  popular: string
  advanced: string
  community: string
  miningServices: string
  miningServicesDescription: string
}

// 翻译内容
export const translations: Record<Language, TranslationContent> = {
  zh: {
    // 通用
    loading: '加载中...',
    error: '错误',
    success: '成功',
    confirm: '确认',
    cancel: '取消',
    submit: '提交',
    back: '返回',
    next: '下一步',
    retry: '重试',
    
    // 导航
    dashboard: '仪表板',
    mining: '挖矿',
    wallet: '钱包',
    swap: '兑换',
    referral: '推荐',
    settings: '设置',
    
    // 钱包
    connectWallet: '连接钱包',
    disconnectWallet: '断开钱包',
    walletConnected: '钱包已连接',
    walletDisconnected: '钱包未连接',
    balance: '余额',
    address: '地址',
    
    // 挖矿
    startMining: '开始挖矿',
    stopMining: '停止挖矿',
    miningStatus: '挖矿状态',
    hashRate: '算力',
    totalRewards: '总奖励',
    pendingRewards: '待确认奖励',
    confirmedRewards: '已确认奖励',
    miningDuration: '挖矿时长',
    
    // 交易
    transactions: '交易',
    transactionHistory: '交易历史',
    deposit: '充值',
    withdrawal: '提现',
    amount: '数量',
    currency: '货币',
    status: '状态',
    pending: '待处理',
    confirmed: '已确认',
    failed: '失败',
    
    // 推荐
    referralCode: '推荐码',
    referralLink: '推荐链接',
    referralCount: '推荐人数',
    referralRewards: '推荐奖励',
    inviteFriends: '邀请朋友',
    
    // 兑换
    from: '从',
    to: '到',
    exchange: '交换',
    slippage: '滑点',
    gasPrice: 'Gas价格',
    
    // 统计
    price: '价格',
    change24h: '24小时涨跌',
    volume: '成交量',
    marketCap: '市值',
    high24h: '24小时最高',
    low24h: '24小时最低',
    
    // 设置
    language: '语言',
    theme: '主题',
    notifications: '通知',
    security: '安全',
    about: '关于',
    
    // 消息
    welcomeMessage: '欢迎使用挖矿平台',
    miningStarted: '挖矿已开始',
    miningStopped: '挖矿已停止',
    transactionSuccess: '交易成功',
    transactionFailed: '交易失败',
    walletConnectionFailed: '钱包连接失败',
    invalidAddress: '无效地址',
    insufficientBalance: '余额不足',
    
    // 服务页面
    ourServices: '我们的服务',
    miningPoolServices: '矿池服务',
    miningPoolDescription: '加入我们的高性能矿池，享受有竞争力的费用和可靠的收益。',
    secureStaking: '安全质押',
    secureStakingDescription: '使用机构级安全性质押您的ETH，获得稳定奖励。',
    defiTrading: 'DeFi交易',
    defiTradingDescription: '使用高级交易工具和自动化策略获得最大收益。',
    groupMining: '团队挖矿',
    groupMiningDescription: '与其他矿工组合资源，提高效率降低成本。',
    lowFee: '低费用1%',
    dailyPayouts: '每日收益',
    uptime: '99.9%在线',
    globalServers: '全球服务器',
    noLockupPeriod: '无锁定期',
    insuranceCovered: '保险覆盖',
    monitoring24x7: '24/7监控',
    autoTradingBots: '自动交易机器人',
    lowLatency: '低延迟',
    advancedCharts: '高级图表',
    apiAccess: 'API访问',
    sharedHardware: '共享硬件',
    splitProfits: '分享利润',
    reducedCosts: '降低成本',
    groupManagement: '团队管理',
    getStarted: '开始使用',
    performanceAnalytics: '性能分析',
    realTimeAnalytics: '实时分析',
    realTimeAnalyticsDescription: '通过实时图表和详细统计监控您的挖矿性能。',
    multiWalletSupport: '多钱包支持',
    multiWalletSupportDescription: '连接多个钱包并在一个地方管理所有资产。',
    support24x7: '24/7支持',
    support24x7Description: '我们的专业支持团队和社区随时为您提供帮助。',
    flexiblePayouts: '灵活收益',
    flexiblePayoutsDescription: '从每日、每周或每月收益时间表中选择。',
    activeMiners: '活跃矿工',
    dailyVolume: '日交易量',
    secure: '安全',
    popular: '热门',
    advanced: '高级',
    community: '社区',
    miningServices: '挖矿服务',
    miningServicesDescription: '全面的加密货币挖矿和DeFi服务，获得最大收益率'
  },
  
  en: {
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    confirm: 'Confirm',
    cancel: 'Cancel',
    submit: 'Submit',
    back: 'Back',
    next: 'Next',
    retry: 'Retry',
    
    // Navigation
    dashboard: 'Dashboard',
    mining: 'Mining',
    wallet: 'Wallet',
    swap: 'Swap',
    referral: 'Referral',
    settings: 'Settings',
    
    // Wallet
    connectWallet: 'Connect Wallet',
    disconnectWallet: 'Disconnect Wallet',
    walletConnected: 'Wallet Connected',
    walletDisconnected: 'Wallet Disconnected',
    balance: 'Balance',
    address: 'Address',
    
    // Mining
    startMining: 'Start Mining',
    stopMining: 'Stop Mining',
    miningStatus: 'Mining Status',
    hashRate: 'Hash Rate',
    totalRewards: 'Total Rewards',
    pendingRewards: 'Pending Rewards',
    confirmedRewards: 'Confirmed Rewards',
    miningDuration: 'Mining Duration',
    
    // Transactions
    transactions: 'Transactions',
    transactionHistory: 'Transaction History',
    deposit: 'Deposit',
    withdrawal: 'Withdrawal',
    amount: 'Amount',
    currency: 'Currency',
    status: 'Status',
    pending: 'Pending',
    confirmed: 'Confirmed',
    failed: 'Failed',
    
    // Referral
    referralCode: 'Referral Code',
    referralLink: 'Referral Link',
    referralCount: 'Referral Count',
    referralRewards: 'Referral Rewards',
    inviteFriends: 'Invite Friends',
    
    // Swap
    from: 'From',
    to: 'To',
    exchange: 'Exchange',
    slippage: 'Slippage',
    gasPrice: 'Gas Price',
    
    // Statistics
    price: 'Price',
    change24h: '24h Change',
    volume: 'Volume',
    marketCap: 'Market Cap',
    high24h: '24h High',
    low24h: '24h Low',
    
    // Settings
    language: 'Language',
    theme: 'Theme',
    notifications: 'Notifications',
    security: 'Security',
    about: 'About',
    
    // Messages
    welcomeMessage: 'Welcome to Mining Platform',
    miningStarted: 'Mining Started',
    miningStopped: 'Mining Stopped',
    transactionSuccess: 'Transaction Successful',
    transactionFailed: 'Transaction Failed',
    walletConnectionFailed: 'Wallet Connection Failed',
    invalidAddress: 'Invalid Address',
    insufficientBalance: 'Insufficient Balance',
    
    // Services Page
    ourServices: 'Our Services',
    miningPoolServices: 'Mining Pool Services',
    miningPoolDescription: 'Join our high-performance mining pools with competitive fees and reliable payouts.',
    secureStaking: 'Secure Staking',
    secureStakingDescription: 'Stake your ETH with institutional-grade security and earn steady rewards.',
    defiTrading: 'DeFi Trading',
    defiTradingDescription: 'Access advanced trading tools and automated strategies for maximum profits.',
    groupMining: 'Group Mining',
    groupMiningDescription: 'Combine resources with other miners for better efficiency and lower costs.',
    lowFee: 'Low 1% fee',
    dailyPayouts: 'Daily payouts',
    uptime: '99.9% uptime',
    globalServers: 'Global servers',
    noLockupPeriod: 'No lock-up period',
    insuranceCovered: 'Insurance covered',
    monitoring24x7: '24/7 monitoring',
    autoTradingBots: 'Auto-trading bots',
    lowLatency: 'Low latency',
    advancedCharts: 'Advanced charts',
    apiAccess: 'API access',
    sharedHardware: 'Shared hardware',
    splitProfits: 'Split profits',
    reducedCosts: 'Reduced costs',
    groupManagement: 'Group management',
    getStarted: 'Get Started',
    performanceAnalytics: 'Performance Analytics',
    realTimeAnalytics: 'Real-time Analytics',
    realTimeAnalyticsDescription: 'Monitor your mining performance with live charts and detailed statistics.',
    multiWalletSupport: 'Multi-Wallet Support',
    multiWalletSupportDescription: 'Connect multiple wallets and manage all your assets in one place.',
    support24x7: '24/7 Support',
    support24x7Description: 'Get help anytime with our dedicated support team and community.',
    flexiblePayouts: 'Flexible Payouts',
    flexiblePayoutsDescription: 'Choose from daily, weekly, or monthly payout schedules.',
    activeMiners: 'Active Miners',
    dailyVolume: 'Daily Volume',
    secure: 'Secure',
    popular: 'Popular',
    advanced: 'Advanced',
    community: 'Community',
    miningServices: 'Mining Services',
    miningServicesDescription: 'Comprehensive cryptocurrency mining and DeFi services for maximum profitability'
  }
}

// 获取浏览器语言
export const getBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'zh'
  
  const lang = navigator.language.toLowerCase()
  
  if (lang.startsWith('zh')) return 'zh'
  if (lang.startsWith('en')) return 'en'
  
  return 'zh' // 默认中文
}

// 语言名称映射
export const languageNames: Record<Language, string> = {
  zh: '简体中文',
  en: 'English'
} 