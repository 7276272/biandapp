'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { WalletConnector, WalletStatus } from '@/components/WalletConnector'
import { EnhancedButton } from '@/components/EnhancedButton'
import { ParticleBackground } from '@/components/ParticleBackground'
import { CounterAnimation } from '@/components/CounterAnimation'
import { useWallet } from '@/contexts/WalletContext'
import { usePortfolioValue } from '@/hooks/useData'
import Link from 'next/link'
import {
  User,
  Wallet,
  TrendingUp,
  Eye,
  EyeOff,
  Download,
  FileText,
  Users,
  DollarSign
} from 'lucide-react'

export default function UserPage() {
  const { isConnected, address } = useWallet()
  const [showBalance, setShowBalance] = useState(true)
  const [withdrawAmount, setWithdrawAmount] = useState('')

  // Mock portfolio data - same as original
  const portfolioHoldings = {
    'ethereum': 2.5,
    'bitcoin': 0.1,
    'tether': 1000
  }

  const { value: portfolioValue, breakdown: portfolioBreakdown } = usePortfolioValue(portfolioHoldings)

  // Mock user data based on reference site
  const userData = {
    totalAssets: 0,
    totalIncome: 0.00,
    todayEarnings: 0.00,
    rewardYieldRate: 0.00,
    lockedBalance: 0,
    availableBalance: 0
  }

  const myIncomeData = {
    totalIncome: 0.00,
    todayIncome: 0.00,
    totalAssets: 0
  }

  const myTeamData = {
    totalIncome: 0,
    todayIncome: 0,
    totalAssets: 0
  }

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />

      {/* Header */}
      <header className="flex items-center justify-between p-4 frosted-glass border-b border-border/20 text-[#000000] bg-[#f9f900] font-bold relative z-10">
        <div className="flex items-center gap-2 slide-in-up">
          <img src="https://ext.same-assets.com/590002659/3894291359.png" alt="English" className="w-5 h-5" />
          <span className="text-sm text-muted-foreground">English</span>
        </div>
        <WalletStatus />
      </header>

      {/* Main Content */}
      <div className="p-4 pb-20 relative z-10">

        {/* Asset Bill Link */}
        <div className="flex justify-end mb-4 slide-in-up">
          <Link href="/bill" className="flex items-center gap-1 text-primary text-sm hover:underline">
            <img src="https://ext.same-assets.com/590002659/3392729787.svg" alt="" className="w-4 h-4" />
            Asset Bill
          </Link>
        </div>

        {/* Total Assets Section */}
        <section className="text-center mb-6 slide-in-up">
          <h1 className="text-2xl font-extrabold text-white mb-2">Total Assets</h1>
          <div className="text-4xl font-bold mb-1">
            <CounterAnimation end={userData.totalAssets} decimals={0} className="text-primary" />
            <span className="text-primary text-xl ml-1">USDT</span>
          </div>
          <div className="text-muted-foreground text-sm">
            Total Income: <span className="text-primary text-lg">
              <CounterAnimation end={userData.totalIncome} decimals={2} suffix=" ETH" />
            </span>
            <div className="text-xs text-muted-foreground/70">≈ 0 USDT</div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="mb-6">
          <Card className="frosted-glass">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-muted-foreground text-xs mb-2">Today Earnings</div>
                  <div>
                    <span className="text-primary">
                      <CounterAnimation end={userData.todayEarnings} decimals={2} suffix=" ETH" />
                    </span>
                    <div className="text-xs text-muted-foreground/70">≈ 0.00 USDT</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground text-xs mb-2">Reward Yield Rate</div>
                  <div className="text-primary text-lg">
                    <CounterAnimation end={userData.rewardYieldRate} decimals={2} suffix="%" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground text-xs mb-2">Locked Balance</div>
                  <div className="text-primary text-lg">
                    <CounterAnimation end={userData.lockedBalance} decimals={0} suffix=" USDT" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground text-xs mb-2">Available Balance</div>
                  <div className="text-primary text-lg">
                    <CounterAnimation end={userData.availableBalance} decimals={0} suffix=" USDT" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Withdraw Section */}
        <section className="mb-6">
          <h2 className="text-lg font-medium mb-4 text-center">Withdraw</h2>
          <Card className="frosted-glass">
            <CardContent className="p-4">
              <Input
                type="number"
                placeholder="Please enter the withdrawal amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="mb-4 bg-background/50 border-border/20"
              />
              <div className="flex justify-between items-center text-sm mb-4">
                <span>Available: {userData.availableBalance} USDT</span>
                <Link href="/record" className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                  <img src="https://ext.same-assets.com/590002659/3082658137.svg" alt="" className="w-4 h-4" />
                  Record
                </Link>
              </div>
              <EnhancedButton className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Confirm
              </EnhancedButton>
            </CardContent>
          </Card>
        </section>

        {/* My Income Section */}
        <section className="mb-6">
          <Card className="frosted-glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Income</CardTitle>
                <Link href="/user/income">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    Income
                  </Badge>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Card className="bg-background/30 border-border/20">
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-muted-foreground text-xs mb-2">Total Income</div>
                      <div className="text-sm mb-1">
                        <CounterAnimation end={myIncomeData.totalIncome} decimals={2} />
                      </div>
                      <div className="text-xs text-muted-foreground">ETH</div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground text-xs mb-2">Today Income</div>
                      <div className="text-sm mb-1">
                        <CounterAnimation end={myIncomeData.todayIncome} decimals={2} />
                      </div>
                      <div className="text-xs text-muted-foreground">ETH</div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground text-xs mb-2">Total Assets</div>
                      <div className="text-sm mb-1">
                        <CounterAnimation end={myIncomeData.totalAssets} decimals={0} />
                      </div>
                      <div className="text-xs text-muted-foreground">USDT</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </section>

        {/* My Team Section */}
        <section className="mb-6">
          <Card className="frosted-glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Team</CardTitle>
                <Link href="/user/teams">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    View Team
                  </Badge>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Card className="bg-background/30 border-border/20">
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-muted-foreground text-xs mb-2">Total Income</div>
                      <div className="text-sm mb-1">
                        <CounterAnimation end={myTeamData.totalIncome} decimals={0} />
                      </div>
                      <div className="text-xs text-muted-foreground">ETH</div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground text-xs mb-2">Today Income</div>
                      <div className="text-sm mb-1">
                        <CounterAnimation end={myTeamData.todayIncome} decimals={0} />
                      </div>
                      <div className="text-xs text-muted-foreground">ETH</div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground text-xs mb-2">Total Assets</div>
                      <div className="text-sm mb-1">
                        <CounterAnimation end={myTeamData.totalAssets} decimals={0} />
                      </div>
                      <div className="text-xs text-muted-foreground">USDT</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </section>

        {/* My Team Data Display */}
        <section className="mb-6">
          <h2 className="text-center mb-4 text-lg font-medium">My Team</h2>
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <img
              src="https://ext.same-assets.com/590002659/2594402150.png"
              alt="No Data"
              className="w-24 h-24 mb-4 opacity-50 floating"
            />
            <span className="text-muted-foreground">No Data</span>
          </div>
        </section>

        {/* Wallet Connection Prompt */}
        {!isConnected && (
          <section className="mb-6">
            <Card className="frosted-glass">
              <CardContent className="p-6 text-center">
                <Wallet className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-muted-foreground mb-4">
                  Connect your wallet to view your real balance and start earning
                </p>
                <WalletConnector />
              </CardContent>
            </Card>
          </section>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 frosted-glass border-t border-border z-20">
        <div className="flex justify-around items-center py-2">
          {[
            { src: "https://ext.same-assets.com/590002659/2588141536.png", alt: "Home", label: "Home", active: false, href: "/" },
            { src: "https://ext.same-assets.com/590002659/1667291039.png", alt: "Mining", label: "Mining", active: false, href: "/mining" },
            { src: "https://ext.same-assets.com/590002659/3073358967.png", alt: "Service", label: "Service", active: false, href: "/service" },
            { src: "https://ext.same-assets.com/590002659/855995434.png", alt: "Invite", label: "Invite", active: false, href: "/invite" },
            { src: "https://ugc.same-assets.com/cTo6gN_G6NBVMaUjomt78eMiBtGfLzrd.png", alt: "User", label: "User", active: true, href: "/user" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center py-2 px-4 transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                item.active ? 'scale-110' : ''
              }`}
            >
              <img
                src={item.src}
                alt={item.alt}
                className={`w-6 h-6 mb-1 transition-all duration-300 ${
                  item.active
                    ? 'filter brightness-0 saturate-100 contrast-200 hue-rotate-45'
                    : 'filter brightness-0 invert'
                }`}
              />
              <span className={`text-xs transition-all duration-300 ${
                item.active ? 'text-primary font-semibold' : 'text-white'
              }`}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Add bottom padding to account for fixed navigation */}
      <div className="h-20" />
    </div>
  )
}
