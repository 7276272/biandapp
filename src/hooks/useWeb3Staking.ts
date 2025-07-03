import { useState, useCallback, useEffect } from 'react'
import { useWallet } from '@/contexts/WalletContext'
import { CURRENT_NETWORK, USDT_ABI, SUPPORT_ABI, GAS_CONFIG } from '@/lib/contracts'

// 临时使用window.ethereum，后续可以集成到现有的Web3配置中
declare global {
  interface Window {
    ethereum?: any
  }
}

export function useWeb3Staking() {
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [web3, setWeb3] = useState<any>(null)
  const [usdtBalance, setUsdtBalance] = useState('0')
  const [allowance, setAllowance] = useState('0')
  const [isInitialized, setIsInitialized] = useState(false)
  
  const { account, isConnected } = useWallet()

  // 初始化Web3
  const initWeb3 = useCallback(async () => {
    if (typeof window !== 'undefined' && window.ethereum && !web3) {
      try {
        console.log('🔄 开始初始化Web3...')
        const Web3 = (await import('web3')).default
        const web3Instance = new Web3(window.ethereum)
        setWeb3(web3Instance)
        setIsInitialized(true)
        console.log('✅ Web3初始化成功')
        return web3Instance
      } catch (error) {
        console.error('❌ Web3初始化失败:', error)
        setIsInitialized(false)
        throw error
      }
    } else if (!window.ethereum) {
      console.warn('⚠️ 未检测到MetaMask')
      setIsInitialized(false)
      throw new Error('请安装MetaMask钱包')
    }
    return web3
  }, [web3])

  // 自动初始化Web3
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized && !web3) {
      initWeb3().catch((error) => {
        console.error('自动初始化Web3失败:', error)
      })
    }
  }, [initWeb3, isInitialized, web3])

  // 切换到当前配置的网络 (Tenderly测试网)
  const switchToCurrentNetwork = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('请安装MetaMask钱包')
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${CURRENT_NETWORK.CHAIN_ID.toString(16)}` }],
      })
    } catch (error: any) {
      if (error.code === 4902) {
        // 网络不存在，添加新网络
        const networkName = CURRENT_NETWORK.CHAIN_ID === 1 
          ? 'Ethereum Mainnet (Tenderly)' 
          : CURRENT_NETWORK.CHAIN_ID === 56 
          ? 'Binance Smart Chain' 
          : 'BSC Testnet'
          
        const nativeCurrency = CURRENT_NETWORK.CHAIN_ID === 1 
          ? { name: 'Ethereum', symbol: 'ETH', decimals: 18 }
          : { name: 'BNB', symbol: 'BNB', decimals: 18 }
          
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${CURRENT_NETWORK.CHAIN_ID.toString(16)}`,
            chainName: networkName,
            nativeCurrency: nativeCurrency,
            rpcUrls: [CURRENT_NETWORK.RPC_URL],
            blockExplorerUrls: [CURRENT_NETWORK.EXPLORER_URL]
          }]
        })
      } else {
        throw error
      }
    }
  }, [])

  // 保留旧名称以兼容现有代码
  const switchToBSC = switchToCurrentNetwork

  // 获取USDT余额
  const getUSDTBalance = useCallback(async () => {
    if (!web3 || !account || !isInitialized) {
      console.log('Web3未初始化或账户未连接，跳过余额查询')
      return '0'
    }
    
    // 检查账户地址是否为有效字符串
    if (typeof account !== 'string' || !account.startsWith('0x')) {
      console.log('无效的账户地址，跳过余额查询:', account)
      return '0'
    }
    
    try {
      const usdtContract = new web3.eth.Contract(USDT_ABI, CURRENT_NETWORK.USDT_CONTRACT)
      const balance = await usdtContract.methods.balanceOf(account).call()
      const balanceFormatted = web3.utils.fromWei(balance, 'ether')
      setUsdtBalance(balanceFormatted)
      return balanceFormatted
    } catch (error) {
      console.error('获取USDT余额失败:', error)
      setUsdtBalance('0')
      return '0'
    }
  }, [web3, account, isInitialized])

  // 检查USDT授权额度
  const checkAllowance = useCallback(async (spenderAddress: string) => {
    if (!web3 || !account || !isInitialized) {
      console.log('Web3未初始化或账户未连接，跳过授权检查')
      return '0'
    }
    
    // 检查账户地址是否为有效字符串
    if (typeof account !== 'string' || !account.startsWith('0x')) {
      console.log('无效的账户地址，跳过授权检查:', account)
      return '0'
    }
    
    try {
      const usdtContract = new web3.eth.Contract(USDT_ABI, CURRENT_NETWORK.USDT_CONTRACT)
      const allowanceAmount = await usdtContract.methods.allowance(account, spenderAddress).call()
      const allowanceFormatted = web3.utils.fromWei(allowanceAmount, 'ether')
      setAllowance(allowanceFormatted)
      
      // 如果授权额度大于0，设置为已授权
      const authorized = parseFloat(allowanceFormatted) > 0
      setIsAuthorized(authorized)
      return allowanceFormatted
    } catch (error) {
      console.error('检查授权额度失败:', error)
      setAllowance('0')
      setIsAuthorized(false)
      return '0'
    }
  }, [web3, account, isInitialized])

  // 当钱包连接状态改变时，重新获取数据
  useEffect(() => {
    if (isConnected && account && web3 && isInitialized && typeof account === 'string' && account.startsWith('0x')) {
      // 延迟执行，避免阻塞渲染
      const timer = setTimeout(async () => {
        try {
          await getUSDTBalance()
          await checkAllowance(CURRENT_NETWORK.TREASURY_ADDRESS)
        } catch (error) {
          console.error('获取钱包数据时出错:', error)
          // 即使出错也不影响正常使用
        }
      }, 100)
      
      return () => clearTimeout(timer)
    } else {
      // 未连接时重置状态
      setUsdtBalance('0')
      setAllowance('0')
      setIsAuthorized(false)
    }
  }, [isConnected, account, web3, isInitialized, getUSDTBalance, checkAllowance])

  // 授权USDT给资金接收地址
  const approveUSDT = useCallback(async (amount?: string) => {
    if (!web3 || !account) {
      throw new Error('请先连接钱包')
    }

    if (!isInitialized) {
      throw new Error('Web3未初始化，请稍后重试')
    }

    try {
      setIsLoading(true)
      await switchToBSC()

      const usdtContract = new web3.eth.Contract(USDT_ABI, CURRENT_NETWORK.USDT_CONTRACT)
      
      // 默认授权大额度 (1,000,000 USDT)
      const approveAmount = amount || '1000000'
      const amountWei = web3.utils.toWei(approveAmount, 'ether')
      
      console.log('🔑 开始授权USDT...', {
        amount: approveAmount,
        to: CURRENT_NETWORK.TREASURY_ADDRESS
      })

      const tx = await usdtContract.methods
        .approve(CURRENT_NETWORK.TREASURY_ADDRESS, amountWei)
        .send({
          from: account,
          gas: GAS_CONFIG.APPROVE_GAS_LIMIT,
          gasPrice: web3.utils.toWei(GAS_CONFIG.GAS_PRICE_GWEI.toString(), 'gwei')
        })

      console.log('✅ USDT授权成功:', tx.transactionHash)
      
      // 重新检查授权额度
      await checkAllowance(CURRENT_NETWORK.TREASURY_ADDRESS)
      
      return tx
    } catch (error) {
      console.error('❌ USDT授权失败:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [web3, account, isInitialized, switchToBSC, checkAllowance])

  // 创建质押投资 (调用SupportXhsk合约的create函数)
  const createStaking = useCallback(async (amount: string, ratio: number = 100) => {
    if (!web3 || !account) {
      throw new Error('请先连接钱包')
    }

    if (!isInitialized) {
      throw new Error('Web3未初始化，请稍后重试')
    }

    if (!CURRENT_NETWORK.SUPPORT_CONTRACT) {
      throw new Error('SupportXhsk合约地址未配置，请先部署合约')
    }

    try {
      setIsLoading(true)
      await switchToBSC()

      const supportContract = new web3.eth.Contract(SUPPORT_ABI, CURRENT_NETWORK.SUPPORT_CONTRACT)
      const amountWei = web3.utils.toWei(amount, 'ether')
      
      console.log('🔄 开始创建质押投资...', {
        amount: amount,
        ratio: ratio,
        contract: CURRENT_NETWORK.SUPPORT_CONTRACT
      })

      const tx = await supportContract.methods
        .create(amountWei, ratio)
        .send({
          from: account,
          gas: GAS_CONFIG.STAKE_GAS_LIMIT,
          gasPrice: web3.utils.toWei(GAS_CONFIG.GAS_PRICE_GWEI.toString(), 'gwei')
        })

      console.log('✅ 质押创建成功:', tx.transactionHash)
      
      // 更新余额
      await getUSDTBalance()
      
      return tx
    } catch (error) {
      console.error('❌ 创建质押失败:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [web3, account, isInitialized, switchToBSC, getUSDTBalance])

  return {
    // 状态
    isLoading,
    isAuthorized,
    usdtBalance,
    allowance,
    isInitialized,
    
    // 方法
    initWeb3,
    switchToBSC: switchToCurrentNetwork,
    getUSDTBalance,
    checkAllowance,
    approveUSDT,
    createStaking
  }
} 