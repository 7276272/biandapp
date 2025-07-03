'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { useWallet } from '@/contexts/WalletContext'
import BottomNavigation, { BottomSpacer } from '@/components/BottomNavigation'

export default function MiningPage() {
  const { account, isConnected, balance, connect, disconnect } = useWallet()

  // 格式化地址显示
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // 格式化余额
  const formatBalance = (balance: string | undefined) => {
    return balance ? parseFloat(balance).toFixed(4) : '0.0000'
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 frosted-glass border-b border-border/20 text-[#000000] bg-[#f9f900] font-bold">
        <div className="flex items-center gap-2 slide-in-up">
          <img src="https://ext.same-assets.com/590002659/3894291359.png" alt="English" className="w-5 h-5" />
          <span className="text-sm text-muted-foreground">English</span>
        </div>
        
        {isConnected ? (
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-xs text-gray-600">Connected</div>
              <div className="text-sm font-mono">{formatAddress(account!)}</div>
            </div>
            <Button 
              onClick={disconnect}
              className="text-primary-foreground hover:bg-red-600 font-semibold bg-red-500 btn-glow text-xs px-3 py-1"
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <Button 
            onClick={connect}
            className="text-primary-foreground hover:bg-primary/90 font-semibold bg-[#ffff00] btn-glow"
          >
            Connect Wallet
          </Button>
        )}
      </header>

      {/* Main Content */}
      <div className="p-4 pb-20">
        {/* Hero Section */}
        <div className="text-center mb-8 slide-in-up">
          <h1 className="text-xl mb-4 text-white">My Mining Pool</h1>
          <div className="text-[#FFA500] text-3xl font-bold mb-1">
            <span className="gold-text">
              {isConnected ? `${formatBalance(balance)} ETH` : '0.00 ETH'}
            </span>
            <div className="text-[13px] text-gray-500 font-normal">≈ 0.00 USDT</div>
          </div>
          <div className="text-gray-400 text-sm">
            {isConnected ? 'Wallet Balance' : 'Total Production'}
          </div>
        </div>

        {/* Stats Card */}
        <Card className="frosted-glass mb-8 slide-in-up" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-border/20 pb-3">
              <span className="text-gray-400">Wallet Status</span>
              <span className={`text-${isConnected ? 'green' : 'red'}-400`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            {isConnected && (
              <div className="flex justify-between items-center border-b border-border/20 pb-3">
                <span className="text-gray-400">Wallet Address</span>
                <span className="text-white font-mono text-sm">{formatAddress(account!)}</span>
              </div>
            )}
            <div className="flex justify-between items-center border-b border-border/20 pb-3">
              <span className="text-gray-400">Balance</span>
              <div className="text-right">
                <div className="text-[14px] text-[#FFA500] font-medium">
                  {isConnected ? `${formatBalance(balance)} ETH` : '0.00 ETH'}
                </div>
                <div className="text-[12px] text-gray-500">≈ 0.00 USDT</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Pool Status</span>
              <span className="text-white">
                {isConnected ? 'Active' : 'Inactive'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Liquidity Reward Yield */}
        <div className="mb-8 slide-in-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-center mb-4 text-white gold-text">Liquidity Reward Yield</h2>
          <Card className="frosted-glass overflow-hidden">
            <CardContent className="p-0">
              {/* Table Header */}
              <div className="grid grid-cols-3 text-sm p-4 border-b border-border/20 bg-muted/10">
                <div className="text-gray-400">
                  Amount<br />USDT
                </div>
                <div className="text-gray-400 text-center">
                  Return Rate<br />24H
                </div>
                <div className="text-gray-400 text-right">
                  Profit<br />USDT
                </div>
              </div>

              {/* Table Rows */}
              <div className="space-y-0">
                {[
                  { amount: "0-999", rate: "0.50%", profit: "0-4.95" },
                  { amount: "1000-4999", rate: "0.75%", profit: "7.5-37.49" },
                  { amount: "5000-9999", rate: "1.25%", profit: "62.5-124.98" },
                  { amount: "10000-29999", rate: "2.00%", profit: "200-599.98" },
                  { amount: "30000-59999", rate: "3.00%", profit: "900-1799.97" },
                  { amount: "60000-99999", rate: "3.50%", profit: "2100-3499.96" },
                  { amount: "100000-299999", rate: "4.50%", profit: "4500-13499.95" },
                  { amount: "300000-999999", rate: "5.00%", profit: "15000-49999.95" },
                ].map((row) => (
                  <div key={row.amount} className="grid grid-cols-3 text-sm p-4 border-b border-border/10 hover:bg-white/5 transition-colors duration-300">
                    <div className="text-white counter-text">{row.amount}</div>
                    <div className="text-center text-green-400 counter-text">{row.rate}</div>
                    <div className="text-right text-[#FFA500] counter-text">{row.profit}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mining Records */}
        <div className="mb-8 slide-in-up" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-center mb-4 text-white gold-text">Mining Records</h2>
          <div className="flex flex-col items-center justify-center text-gray-400 h-48">
            <img
              src="https://ext.same-assets.com/590002659/708123250.png"
              alt="No Data"
              className="w-24 h-24 mb-4 opacity-50 floating"
            />
            <span className="text-gray-400">No Data</span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
      <BottomSpacer />
    </div>
  )
}
