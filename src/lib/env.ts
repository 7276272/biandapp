// 环境变量配置
export const env = {
  // API服务器地址 - 线上服务器
  API_BASE_URL: 'https://us4dt.com/',
  
  // WebSocket地址
  WS_BASE_URL: 'wss://us4dt.com/ws',
  
  // 是否为开发环境
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  
  // 是否为生产环境
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  
  // 应用配置
  APP_NAME: 'BSC Pool DApp',
  APP_VERSION: '1.0.0',
  
  // 默认语言
  DEFAULT_LANGUAGE: 'en',
  
  // 支持的语言列表
  SUPPORTED_LANGUAGES: ['zh', 'en', 'ja', 'ko', 'es', 'fr', 'de', 'ru'],
  
  // API路径
  API_PATHS: {
    // 用户相关
    USER_INFO: 'api/xhsk/userinfo.html',
    USER_BIND: 'api/xhsk/bind.html',
    
    // 钱包连接
    WALLET_CONNECT: 'api/api/walletConnect.html',
    
    // 文章公告
    ARTICLES: 'api/xhsk/articles.html',
    ARTICLE_DETAIL: 'api/xhsk/artdetail.html',
    
    // 财务记录
    REWARD_LIST: 'api/xhsk/rewardlist.html',
    TASKS_LIST: 'api/xhsk/taskslist.html',
    PLEDGE_LIST: 'api/xhsk/pledgelist.html',
    WITHDRAW_LIST: 'api/xhsk/withdrawlist.html',
    WITHDRAW: 'api/xhsk/withdraw.html',
    
    // 邀请相关
    INVITE_LIST: 'api/xhsk/invitelist.html',
    
    // 配置数据
    YUN_POOL: 'api/xhsk/getYunPool.html',
    STATISTICS: 'api/xhsk/getStatistics.html',
    CURRENCY: 'api/xhsk/getCurrency.html',
    
    // 登录日志
    LOGIN_LIST: 'api/xhsk/loginlist.html',
    
    // 其他
    GET_SIGN: 'api/xhsk/getSign.html'
  }
}

export default env 