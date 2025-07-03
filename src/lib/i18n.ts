// 国际化配置
export type Language = 'zh' | 'en' | 'ja' | 'ko' | 'es' | 'fr' | 'de' | 'ru'

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
  swap: string
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
    swap: '兑换',
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
    swap: 'Swap',
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
  },
  
  ja: {
    // 共通
    loading: '読み込み中...',
    error: 'エラー',
    success: '成功',
    confirm: '確認',
    cancel: 'キャンセル',
    submit: '送信',
    back: '戻る',
    next: '次へ',
    retry: '再試行',
    
    // ナビゲーション
    dashboard: 'ダッシュボード',
    mining: 'マイニング',
    wallet: 'ウォレット',
    swap: 'スワップ',
    referral: '紹介',
    settings: '設定',
    
    // ウォレット
    connectWallet: 'ウォレット接続',
    disconnectWallet: 'ウォレット切断',
    walletConnected: 'ウォレット接続済み',
    walletDisconnected: 'ウォレット未接続',
    balance: '残高',
    address: 'アドレス',
    
    // マイニング
    startMining: 'マイニング開始',
    stopMining: 'マイニング停止',
    miningStatus: 'マイニング状況',
    hashRate: 'ハッシュレート',
    totalRewards: '総報酬',
    pendingRewards: '保留中の報酬',
    confirmedRewards: '確認済み報酬',
    miningDuration: 'マイニング期間',
    
    // 取引
    transactions: '取引',
    transactionHistory: '取引履歴',
    deposit: '入金',
    withdrawal: '出金',
    amount: '金額',
    currency: '通貨',
    status: 'ステータス',
    pending: '保留中',
    confirmed: '確認済み',
    failed: '失敗',
    
    // 紹介
    referralCode: '紹介コード',
    referralLink: '紹介リンク',
    referralCount: '紹介人数',
    referralRewards: '紹介報酬',
    inviteFriends: '友達を招待',
    
    // スワップ
    swap: 'スワップ',
    from: 'から',
    to: 'へ',
    exchange: '交換',
    slippage: 'スリッページ',
    gasPrice: 'ガス価格',
    
    // 統計
    price: '価格',
    change24h: '24時間変動',
    volume: '取引量',
    marketCap: '時価総額',
    high24h: '24時間高値',
    low24h: '24時間安値',
    
    // 設定
    language: '言語',
    theme: 'テーマ',
    notifications: '通知',
    security: 'セキュリティ',
    about: '概要',
    
    // メッセージ
    welcomeMessage: 'マイニングプラットフォームへようこそ',
    miningStarted: 'マイニングが開始されました',
    miningStopped: 'マイニングが停止されました',
    transactionSuccess: '取引が成功しました',
    transactionFailed: '取引が失敗しました',
    walletConnectionFailed: 'ウォレット接続に失敗しました',
    invalidAddress: '無効なアドレス',
    insufficientBalance: '残高不足'
  },
  
  ko: {
    // 공통
    loading: '로딩 중...',
    error: '오류',
    success: '성공',
    confirm: '확인',
    cancel: '취소',
    submit: '제출',
    back: '뒤로',
    next: '다음',
    retry: '재시도',
    
    // 네비게이션
    dashboard: '대시보드',
    mining: '마이닝',
    wallet: '지갑',
    swap: '스왑',
    referral: '추천',
    settings: '설정',
    
    // 지갑
    connectWallet: '지갑 연결',
    disconnectWallet: '지갑 연결 해제',
    walletConnected: '지갑 연결됨',
    walletDisconnected: '지갑 연결 안됨',
    balance: '잔고',
    address: '주소',
    
    // 마이닝
    startMining: '마이닝 시작',
    stopMining: '마이닝 중지',
    miningStatus: '마이닝 상태',
    hashRate: '해시율',
    totalRewards: '총 보상',
    pendingRewards: '대기 중인 보상',
    confirmedRewards: '확인된 보상',
    miningDuration: '마이닝 기간',
    
    // 거래
    transactions: '거래',
    transactionHistory: '거래 기록',
    deposit: '입금',
    withdrawal: '출금',
    amount: '금액',
    currency: '통화',
    status: '상태',
    pending: '대기 중',
    confirmed: '확인됨',
    failed: '실패',
    
    // 추천
    referralCode: '추천 코드',
    referralLink: '추천 링크',
    referralCount: '추천 수',
    referralRewards: '추천 보상',
    inviteFriends: '친구 초대',
    
    // 스왑
    swap: '스왑',
    from: '에서',
    to: '로',
    exchange: '교환',
    slippage: '슬리피지',
    gasPrice: '가스 가격',
    
    // 통계
    price: '가격',
    change24h: '24시간 변동',
    volume: '거래량',
    marketCap: '시가총액',
    high24h: '24시간 최고',
    low24h: '24시간 최저',
    
    // 설정
    language: '언어',
    theme: '테마',
    notifications: '알림',
    security: '보안',
    about: '정보',
    
    // 메시지
    welcomeMessage: '마이닝 플랫폼에 오신 것을 환영합니다',
    miningStarted: '마이닝이 시작되었습니다',
    miningStopped: '마이닝이 중지되었습니다',
    transactionSuccess: '거래가 성공했습니다',
    transactionFailed: '거래가 실패했습니다',
    walletConnectionFailed: '지갑 연결에 실패했습니다',
    invalidAddress: '유효하지 않은 주소',
    insufficientBalance: '잔고 부족'
  },
  
  es: {
    // Común
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    submit: 'Enviar',
    back: 'Atrás',
    next: 'Siguiente',
    retry: 'Reintentar',
    
    // Navegación
    dashboard: 'Panel',
    mining: 'Minería',
    wallet: 'Cartera',
    swap: 'Intercambio',
    referral: 'Referido',
    settings: 'Configuración',
    
    // Cartera
    connectWallet: 'Conectar Cartera',
    disconnectWallet: 'Desconectar Cartera',
    walletConnected: 'Cartera Conectada',
    walletDisconnected: 'Cartera Desconectada',
    balance: 'Saldo',
    address: 'Dirección',
    
    // Minería
    startMining: 'Iniciar Minería',
    stopMining: 'Detener Minería',
    miningStatus: 'Estado de Minería',
    hashRate: 'Tasa de Hash',
    totalRewards: 'Recompensas Totales',
    pendingRewards: 'Recompensas Pendientes',
    confirmedRewards: 'Recompensas Confirmadas',
    miningDuration: 'Duración de Minería',
    
    // Transacciones
    transactions: 'Transacciones',
    transactionHistory: 'Historial de Transacciones',
    deposit: 'Depósito',
    withdrawal: 'Retiro',
    amount: 'Cantidad',
    currency: 'Moneda',
    status: 'Estado',
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    failed: 'Fallido',
    
    // Referido
    referralCode: 'Código de Referido',
    referralLink: 'Enlace de Referido',
    referralCount: 'Número de Referidos',
    referralRewards: 'Recompensas de Referido',
    inviteFriends: 'Invitar Amigos',
    
    // Intercambio
    swap: 'Intercambio',
    from: 'Desde',
    to: 'Hacia',
    exchange: 'Intercambiar',
    slippage: 'Deslizamiento',
    gasPrice: 'Precio del Gas',
    
    // Estadísticas
    price: 'Precio',
    change24h: 'Cambio 24h',
    volume: 'Volumen',
    marketCap: 'Capitalización de Mercado',
    high24h: 'Máximo 24h',
    low24h: 'Mínimo 24h',
    
    // Configuración
    language: 'Idioma',
    theme: 'Tema',
    notifications: 'Notificaciones',
    security: 'Seguridad',
    about: 'Acerca de',
    
    // Mensajes
    welcomeMessage: 'Bienvenido a la Plataforma de Minería',
    miningStarted: 'Minería Iniciada',
    miningStopped: 'Minería Detenida',
    transactionSuccess: 'Transacción Exitosa',
    transactionFailed: 'Transacción Fallida',
    walletConnectionFailed: 'Conexión de Cartera Fallida',
    invalidAddress: 'Dirección Inválida',
    insufficientBalance: 'Saldo Insuficiente'
  },
  
  fr: {
    // Commun
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    confirm: 'Confirmer',
    cancel: 'Annuler',
    submit: 'Soumettre',
    back: 'Retour',
    next: 'Suivant',
    retry: 'Réessayer',
    
    // Navigation
    dashboard: 'Tableau de Bord',
    mining: 'Minage',
    wallet: 'Portefeuille',
    swap: 'Échange',
    referral: 'Parrainage',
    settings: 'Paramètres',
    
    // Portefeuille
    connectWallet: 'Connecter Portefeuille',
    disconnectWallet: 'Déconnecter Portefeuille',
    walletConnected: 'Portefeuille Connecté',
    walletDisconnected: 'Portefeuille Déconnecté',
    balance: 'Solde',
    address: 'Adresse',
    
    // Minage
    startMining: 'Démarrer le Minage',
    stopMining: 'Arrêter le Minage',
    miningStatus: 'État du Minage',
    hashRate: 'Taux de Hachage',
    totalRewards: 'Récompenses Totales',
    pendingRewards: 'Récompenses en Attente',
    confirmedRewards: 'Récompenses Confirmées',
    miningDuration: 'Durée du Minage',
    
    // Transactions
    transactions: 'Transactions',
    transactionHistory: 'Historique des Transactions',
    deposit: 'Dépôt',
    withdrawal: 'Retrait',
    amount: 'Montant',
    currency: 'Devise',
    status: 'Statut',
    pending: 'En Attente',
    confirmed: 'Confirmé',
    failed: 'Échoué',
    
    // Parrainage
    referralCode: 'Code de Parrainage',
    referralLink: 'Lien de Parrainage',
    referralCount: 'Nombre de Parrainages',
    referralRewards: 'Récompenses de Parrainage',
    inviteFriends: 'Inviter des Amis',
    
    // Échange
    swap: 'Échange',
    from: 'De',
    to: 'Vers',
    exchange: 'Échanger',
    slippage: 'Glissement',
    gasPrice: 'Prix du Gaz',
    
    // Statistiques
    price: 'Prix',
    change24h: 'Variation 24h',
    volume: 'Volume',
    marketCap: 'Capitalisation Boursière',
    high24h: 'Haut 24h',
    low24h: 'Bas 24h',
    
    // Paramètres
    language: 'Langue',
    theme: 'Thème',
    notifications: 'Notifications',
    security: 'Sécurité',
    about: 'À Propos',
    
    // Messages
    welcomeMessage: 'Bienvenue sur la Plateforme de Minage',
    miningStarted: 'Minage Démarré',
    miningStopped: 'Minage Arrêté',
    transactionSuccess: 'Transaction Réussie',
    transactionFailed: 'Transaction Échouée',
    walletConnectionFailed: 'Connexion du Portefeuille Échouée',
    invalidAddress: 'Adresse Invalide',
    insufficientBalance: 'Solde Insuffisant'
  },
  
  de: {
    // Allgemein
    loading: 'Wird geladen...',
    error: 'Fehler',
    success: 'Erfolg',
    confirm: 'Bestätigen',
    cancel: 'Abbrechen',
    submit: 'Senden',
    back: 'Zurück',
    next: 'Weiter',
    retry: 'Wiederholen',
    
    // Navigation
    dashboard: 'Dashboard',
    mining: 'Mining',
    wallet: 'Wallet',
    swap: 'Tausch',
    referral: 'Empfehlung',
    settings: 'Einstellungen',
    
    // Wallet
    connectWallet: 'Wallet Verbinden',
    disconnectWallet: 'Wallet Trennen',
    walletConnected: 'Wallet Verbunden',
    walletDisconnected: 'Wallet Getrennt',
    balance: 'Guthaben',
    address: 'Adresse',
    
    // Mining
    startMining: 'Mining Starten',
    stopMining: 'Mining Stoppen',
    miningStatus: 'Mining Status',
    hashRate: 'Hash Rate',
    totalRewards: 'Gesamte Belohnungen',
    pendingRewards: 'Ausstehende Belohnungen',
    confirmedRewards: 'Bestätigte Belohnungen',
    miningDuration: 'Mining Dauer',
    
    // Transaktionen
    transactions: 'Transaktionen',
    transactionHistory: 'Transaktionshistorie',
    deposit: 'Einzahlung',
    withdrawal: 'Abhebung',
    amount: 'Betrag',
    currency: 'Währung',
    status: 'Status',
    pending: 'Ausstehend',
    confirmed: 'Bestätigt',
    failed: 'Fehlgeschlagen',
    
    // Empfehlung
    referralCode: 'Empfehlungscode',
    referralLink: 'Empfehlungslink',
    referralCount: 'Empfehlungsanzahl',
    referralRewards: 'Empfehlungsbelohnungen',
    inviteFriends: 'Freunde Einladen',
    
    // Tausch
    swap: 'Tausch',
    from: 'Von',
    to: 'Zu',
    exchange: 'Tauschen',
    slippage: 'Slippage',
    gasPrice: 'Gaspreis',
    
    // Statistiken
    price: 'Preis',
    change24h: '24h Änderung',
    volume: 'Volumen',
    marketCap: 'Marktkapitalisierung',
    high24h: '24h Hoch',
    low24h: '24h Tief',
    
    // Einstellungen
    language: 'Sprache',
    theme: 'Theme',
    notifications: 'Benachrichtigungen',
    security: 'Sicherheit',
    about: 'Über',
    
    // Nachrichten
    welcomeMessage: 'Willkommen zur Mining-Plattform',
    miningStarted: 'Mining Gestartet',
    miningStopped: 'Mining Gestoppt',
    transactionSuccess: 'Transaktion Erfolgreich',
    transactionFailed: 'Transaktion Fehlgeschlagen',
    walletConnectionFailed: 'Wallet-Verbindung Fehlgeschlagen',
    invalidAddress: 'Ungültige Adresse',
    insufficientBalance: 'Unzureichendes Guthaben'
  },
  
  ru: {
    // Общие
    loading: 'Загрузка...',
    error: 'Ошибка',
    success: 'Успех',
    confirm: 'Подтвердить',
    cancel: 'Отменить',
    submit: 'Отправить',
    back: 'Назад',
    next: 'Далее',
    retry: 'Повторить',
    
    // Навигация
    dashboard: 'Панель управления',
    mining: 'Майнинг',
    wallet: 'Кошелёк',
    swap: 'Обмен',
    referral: 'Реферальная программа',
    settings: 'Настройки',
    
    // Кошелёк
    connectWallet: 'Подключить кошелёк',
    disconnectWallet: 'Отключить кошелёк',
    walletConnected: 'Кошелёк подключён',
    walletDisconnected: 'Кошелёк отключён',
    balance: 'Баланс',
    address: 'Адрес',
    
    // Майнинг
    startMining: 'Начать майнинг',
    stopMining: 'Остановить майнинг',
    miningStatus: 'Статус майнинга',
    hashRate: 'Хешрейт',
    totalRewards: 'Общие награды',
    pendingRewards: 'Ожидающие награды',
    confirmedRewards: 'Подтверждённые награды',
    miningDuration: 'Длительность майнинга',
    
    // Транзакции
    transactions: 'Транзакции',
    transactionHistory: 'История транзакций',
    deposit: 'Депозит',
    withdrawal: 'Вывод',
    amount: 'Сумма',
    currency: 'Валюта',
    status: 'Статус',
    pending: 'Ожидание',
    confirmed: 'Подтверждено',
    failed: 'Неудачно',
    
    // Реферальная программа
    referralCode: 'Реферальный код',
    referralLink: 'Реферальная ссылка',
    referralCount: 'Количество рефералов',
    referralRewards: 'Реферальные награды',
    inviteFriends: 'Пригласить друзей',
    
    // Обмен
    swap: 'Обмен',
    from: 'От',
    to: 'К',
    exchange: 'Обменять',
    slippage: 'Проскальзывание',
    gasPrice: 'Цена газа',
    
    // Статистика
    price: 'Цена',
    change24h: 'Изменение за 24ч',
    volume: 'Объём',
    marketCap: 'Рыночная капитализация',
    high24h: 'Максимум за 24ч',
    low24h: 'Минимум за 24ч',
    
    // Настройки
    language: 'Язык',
    theme: 'Тема',
    notifications: 'Уведомления',
    security: 'Безопасность',
    about: 'О программе',
    
    // Сообщения
    welcomeMessage: 'Добро пожаловать на платформу майнинга',
    miningStarted: 'Майнинг запущен',
    miningStopped: 'Майнинг остановлен',
    transactionSuccess: 'Транзакция успешна',
    transactionFailed: 'Транзакция неудачна',
    walletConnectionFailed: 'Не удалось подключить кошелёк',
    invalidAddress: 'Неверный адрес',
    insufficientBalance: 'Недостаточно средств'
  }
}

// 获取浏览器语言
export const getBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'zh'
  
  const lang = navigator.language.toLowerCase()
  
  if (lang.startsWith('zh')) return 'zh'
  if (lang.startsWith('en')) return 'en'
  if (lang.startsWith('ja')) return 'ja'
  if (lang.startsWith('ko')) return 'ko'
  if (lang.startsWith('es')) return 'es'
  if (lang.startsWith('fr')) return 'fr'
  if (lang.startsWith('de')) return 'de'
  if (lang.startsWith('ru')) return 'ru'
  
  return 'zh' // 默认中文
}

// 语言名称映射
export const languageNames: Record<Language, string> = {
  zh: '简体中文',
  en: 'English',
  ja: '日本語',
  ko: '한국어',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ru: 'Русский'
} 