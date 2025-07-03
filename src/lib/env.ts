// 环境变量配置
export const env = {
  // API服务器地址 - 使用本地Supabase API
  API_BASE_URL: process.env.NODE_ENV === 'production' ? 'https://your-domain.com/' : 'http://localhost:3000/',
  
  // Supabase配置
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jpqqioeidalyiwknzoab.supabase.co',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwcXFpb2VpZGFseWl3a256b2FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3MTQ3NTYsImV4cCI6MjA1MTI5MDc1Nn0.mEjIaJkGRpEfuLwHmCJhwHqgJkTsQjxzNvDhwXdGgEY',
  
  // WebSocket地址 - 暂时禁用
  WS_BASE_URL: null,
  
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
  
  // API路径 - 现在使用本地Supabase API
  API_PATHS: {
    // 用户相关
    USER_INFO: 'api/user/info',
    USER_AUTHORIZE: 'api/user/authorize',
    
    // 质押相关
    STAKING: 'api/staking',
    
    // 管理员相关
    ADMIN_LOGIN: 'api/admin/auth/login',
    ADMIN_STATS: 'api/admin/stats',
    ADMIN_USERS: 'api/admin/users',
  }
}

export default env 