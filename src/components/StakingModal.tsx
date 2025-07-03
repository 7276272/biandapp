'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useWallet } from '@/contexts/WalletContext'
import { useStaking } from '@/hooks/useStaking'
import { Loader2, AlertCircle, CheckCircle, Wallet, TrendingUp } from 'lucide-react'

interface StakingModalProps {
  children: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function StakingModal({ children, isOpen, onOpenChange }: StakingModalProps) {
  const [amount, setAmount] = useState('')
  const [activeType, setActiveType] = useState<1 | 2>(1) // 1: 质押, 2: 提取
  const [isLoading, setIsLoading] = useState(false)
  const [userBalance, setUserBalance] = useState(0)
  const [walletBalance, setWalletBalance] = useState(0)
  const [gasPrice, setGasPrice] = useState(0)
  const [isAuthorized, setIsAuthorized] = useState(false)
  
  const { toast } = useToast()
  const { account, isConnected, connect } = useWallet()
  const { 
    checkAuthorization, 
    approveToken, 
    participateStaking,
    withdrawStaking,
    getUserInfo,
    getWalletBalance,
    getGasPrice
  } = useStaking()

  // 初始化数据
  useEffect(() => {
    if (isConnected && account) {
      loadUserData()
    }
  }, [isConnected, account])

  const loadUserData = async () => {
    try {
      const [userInfo, balance, gas] = await Promise.all([
        getUserInfo(account),
        getWalletBalance(account),
        getGasPrice()
      ])
      
      setUserBalance(userInfo?.balance || 0)
      setWalletBalance(balance)
      setGasPrice(gas)
      setIsAuthorized(userInfo?.isAuthorized || false)
    } catch (error) {
      console.error('加载用户数据失败:', error)
    }
  }

  // 授权USDT
  const handleApprove = async () => {
    if (!isConnected) {
      connect()
      return
    }

    setIsLoading(true)
    try {
      await approveToken()
      await checkAuthorization(account)
      toast({
        title: '授权成功',
        description: 'USDT授权已完成，现在可以进行质押操作',
      })
    } catch (error: any) {
      toast({
        title: '授权失败',
        description: error.message || '授权过程中出现错误',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 参与质押
  const handleParticipate = async () => {
    if (!isConnected) {
      connect()
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: '请输入有效金额',
        description: '质押金额必须大于0',
        variant: 'destructive',
      })
      return
    }

    if (parseFloat(amount) > walletBalance) {
      toast({
        title: '余额不足',
        description: '钱包余额不足以完成此次质押',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      await participateStaking(amount)
      toast({
        title: '质押成功',
        description: `成功质押 ${amount} USDT`,
      })
      setAmount('')
      loadUserData()
    } catch (error: any) {
      toast({
        title: '质押失败',
        description: error.message || '质押过程中出现错误',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 提取
  const handleWithdraw = async () => {
    if (!isConnected) {
      connect()
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: '请输入有效金额',
        description: '提取金额必须大于0',
        variant: 'destructive',
      })
      return
    }

    if (parseFloat(amount) > userBalance) {
      toast({
        title: '余额不足',
        description: '可用余额不足以完成此次提取',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      await withdrawStaking(amount)
      toast({
        title: '提取成功',
        description: `成功提取 ${amount} USDT`,
      })
      setAmount('')
      loadUserData()
    } catch (error: any) {
      toast({
        title: '提取失败',
        description: error.message || '提取过程中出现错误',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 设置最大金额
  const handleMaxAmount = () => {
    if (activeType === 1) {
      setAmount(walletBalance.toString())
    } else {
      setAmount(userBalance.toString())
    }
  }

  // 主要操作按钮
  const renderMainButton = () => {
    if (!isConnected) {
      return (
        <Button onClick={connect} className="w-full" size="lg">
          <Wallet className="mr-2 h-4 w-4" />
          连接钱包
        </Button>
      )
    }

    if (activeType === 1) {
      if (!isAuthorized) {
        return (
          <Button 
            onClick={handleApprove} 
            disabled={isLoading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
            size="lg"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="mr-2 h-4 w-4" />
            )}
            授权 USDT
          </Button>
        )
      }

      return (
        <Button 
          onClick={handleParticipate} 
          disabled={isLoading || !amount}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold"
          size="lg"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <TrendingUp className="mr-2 h-4 w-4" />
          )}
          立即质押
        </Button>
      )
    } else {
      return (
        <Button 
          onClick={handleWithdraw} 
          disabled={isLoading || !amount}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold"
          size="lg"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <TrendingUp className="mr-2 h-4 w-4" />
          )}
          提取
        </Button>
      )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-black/90 border-yellow-500/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-yellow-500">
            智能质押池
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 授权状态指示 */}
          <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-muted/10">
            {isAuthorized ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-green-500 font-medium">已授权</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <span className="text-yellow-500 font-medium">需要授权</span>
              </>
            )}
          </div>

          {/* 余额信息 */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">钱包余额</div>
                <div className="text-lg font-bold text-yellow-500">
                  {walletBalance.toFixed(2)} USDT
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">可用余额</div>
                <div className="text-lg font-bold text-green-500">
                  {userBalance.toFixed(2)} USDT
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 操作类型选择 */}
          <div className="flex gap-2">
            <Button
              variant={activeType === 1 ? "default" : "outline"}
              onClick={() => setActiveType(1)}
              className="flex-1"
            >
              质押
            </Button>
            <Button
              variant={activeType === 2 ? "default" : "outline"}
              onClick={() => setActiveType(2)}
              className="flex-1"
            >
              提取
            </Button>
          </div>

          {/* 金额输入 */}
          <div className="space-y-2">
            <Label htmlFor="amount">
              {activeType === 1 ? '质押金额' : '提取金额'}
            </Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="输入金额"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pr-16"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs"
                onClick={handleMaxAmount}
              >
                最大
              </Button>
            </div>
          </div>

          {/* Gas费用信息 */}
          <div className="text-sm text-muted-foreground text-center">
            预估Gas费用: {gasPrice.toFixed(6)} BNB
          </div>

          {/* 主要操作按钮 */}
          {renderMainButton()}

          {/* 提示信息 */}
          {activeType === 1 && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <p className="text-sm text-yellow-500">
                💡 质押前需要先授权USDT代币转账权限
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 