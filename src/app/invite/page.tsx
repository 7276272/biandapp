'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { WalletStatus } from '@/components/WalletConnector'
import { EnhancedButton } from '@/components/EnhancedButton'
import { ParticleBackground } from '@/components/ParticleBackground'
import { CounterAnimation } from '@/components/CounterAnimation'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import {
  Copy,
  Share2,
  Users,
  Gift,
  TrendingUp,
  Award,
  CheckCircle,
  ExternalLink,
  QrCode,
  DollarSign
} from 'lucide-react'

export default function InvitePage() {
  const [copied, setCopied] = useState(false)
  const [referralCode] = useState('BTC-MINE-2024-XY9Z')
  const [referralLink] = useState(`https://cryptomining.app/ref/${referralCode}`)

  const copyReferralLink = async () => {
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareReferralLink = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Join Crypto Mining Platform',
        text: 'Start earning with cryptocurrency mining!',
        url: referralLink,
      })
    }
  }

  const referralStats = [
    { label: 'Total Referrals', value: 24, icon: <Users className="w-6 h-6" />, color: 'text-blue-400' },
    { label: 'Active Miners', value: 18, icon: <TrendingUp className="w-6 h-6" />, color: 'text-green-400' },
    { label: 'Total Earned', value: 2.84, suffix: ' ETH', icon: <DollarSign className="w-6 h-6" />, color: 'text-primary' },
    { label: 'This Month', value: 0.45, suffix: ' ETH', icon: <Award className="w-6 h-6" />, color: 'text-yellow-400' },
  ]

  const rewardTiers = [
    {
      tier: 'Bronze',
      referrals: '1-5 Referrals',
      commission: '5%',
      bonus: '0.01 ETH',
      color: 'bg-amber-600',
      achieved: true
    },
    {
      tier: 'Silver',
      referrals: '6-15 Referrals',
      commission: '7.5%',
      bonus: '0.05 ETH',
      color: 'bg-gray-400',
      achieved: true
    },
    {
      tier: 'Gold',
      referrals: '16-30 Referrals',
      commission: '10%',
      bonus: '0.1 ETH',
      color: 'bg-yellow-500',
      achieved: true
    },
    {
      tier: 'Platinum',
      referrals: '31-50 Referrals',
      commission: '12.5%',
      bonus: '0.25 ETH',
      color: 'bg-blue-400',
      achieved: false
    },
    {
      tier: 'Diamond',
      referrals: '50+ Referrals',
      commission: '15%',
      bonus: '0.5 ETH',
      color: 'bg-purple-500',
      achieved: false
    }
  ]

  const recentReferrals = [
    {
      address: '0x1234...5678',
      date: '2024-01-15',
      status: 'Active',
      earned: '0.125 ETH',
      tier: 'Gold'
    },
    {
      address: '0x9876...4321',
      date: '2024-01-14',
      status: 'Active',
      earned: '0.089 ETH',
      tier: 'Silver'
    },
    {
      address: '0x5555...9999',
      date: '2024-01-13',
      status: 'Pending',
      earned: '0.000 ETH',
      tier: 'Bronze'
    },
  ]

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

        {/* Hero Section */}
        <section className="text-center mb-8 slide-in-up">
          <h1 className="text-4xl font-bold mb-4 gold-text">Invite & Earn</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Invite friends and earn up to 15% commission on their mining rewards
          </p>
        </section>

        {/* Referral Stats */}
        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {referralStats.map((stat, index) => (
              <Card key={stat.label} className="frosted-glass floating" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-4 text-center">
                  <div className={`${stat.color} mb-2 flex justify-center`}>{stat.icon}</div>
                  <div className="text-2xl font-bold text-white">
                    <CounterAnimation
                      end={stat.value}
                      decimals={stat.suffix?.includes('ETH') ? 2 : 0}
                      suffix={stat.suffix || ''}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Referral Link Section */}
        <section className="mb-8">
          <Card className="frosted-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Your Referral Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Referral Code</label>
                <div className="flex gap-2">
                  <Input
                    value={referralCode}
                    readOnly
                    className="bg-muted/20 border-border/20"
                  />
                  <EnhancedButton
                    variant="outline"
                    onClick={copyReferralLink}
                    className="shrink-0"
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </EnhancedButton>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Referral Link</label>
                <div className="flex gap-2">
                  <Input
                    value={referralLink}
                    readOnly
                    className="bg-muted/20 border-border/20 text-sm"
                  />
                  <EnhancedButton
                    variant="outline"
                    onClick={shareReferralLink}
                    className="shrink-0"
                  >
                    <Share2 className="w-4 h-4" />
                  </EnhancedButton>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 pt-4">
                <EnhancedButton
                  onClick={copyReferralLink}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {copied ? 'Link Copied!' : 'Copy Link'}
                </EnhancedButton>
                <EnhancedButton
                  variant="outline"
                  className="flex-1"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Generate QR Code
                </EnhancedButton>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Reward Tiers */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 gold-text text-center">Referral Reward Tiers</h2>
          <div className="space-y-4">
            {rewardTiers.map((tier, index) => (
              <Card
                key={tier.tier}
                className={`frosted-glass ${tier.achieved ? 'ring-2 ring-primary/50' : ''} floating`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full ${tier.color}`} />
                      <div>
                        <h3 className="font-semibold text-lg">{tier.tier}</h3>
                        <p className="text-sm text-muted-foreground">{tier.referrals}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{tier.commission}</div>
                      <div className="text-sm text-muted-foreground">Commission</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-yellow-400">{tier.bonus}</div>
                      <div className="text-sm text-muted-foreground">Bonus</div>
                    </div>
                    {tier.achieved && (
                      <Badge className="bg-green-600 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Achieved
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Referrals */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 gold-text text-center">Recent Referrals</h2>
          <Card className="frosted-glass">
            <CardContent className="p-0">
              <div className="divide-y divide-border/20">
                {recentReferrals.map((referral, index) => (
                  <div key={referral.address} className="p-4 hover:bg-muted/10 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-mono text-sm">{referral.address}</div>
                          <div className="text-xs text-muted-foreground">{referral.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-primary">{referral.earned}</div>
                        <Badge
                          variant={referral.status === 'Active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {referral.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* How It Works */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 gold-text text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="frosted-glass floating">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Share Your Link</h3>
                <p className="text-sm text-muted-foreground">
                  Copy your unique referral link and share it with friends through social media, email, or messaging.
                </p>
              </CardContent>
            </Card>

            <Card className="frosted-glass floating" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">Friends Join & Mine</h3>
                <p className="text-sm text-muted-foreground">
                  When someone signs up using your link and starts mining, they become your referral.
                </p>
              </CardContent>
            </Card>

            <Card className="frosted-glass floating" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">Earn Commission</h3>
                <p className="text-sm text-muted-foreground">
                  Receive up to 15% commission on their mining rewards automatically to your wallet.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <Card className="frosted-glass">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">When do I receive my commission?</h4>
                <p className="text-sm text-muted-foreground">
                  Commissions are paid automatically every 24 hours directly to your connected wallet.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Is there a limit to how many people I can refer?</h4>
                <p className="text-sm text-muted-foreground">
                  No! There's no limit. The more people you refer, the higher your tier and commission rate.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">How long do referral commissions last?</h4>
                <p className="text-sm text-muted-foreground">
                  You earn commissions for as long as your referrals remain active miners on the platform.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 frosted-glass border-t border-border z-20">
        <div className="flex justify-around items-center py-2">
          {[
            { src: "https://ext.same-assets.com/590002659/2588141536.png", alt: "Home", label: "Home", active: false, href: "/" },
            { src: "https://ext.same-assets.com/590002659/1667291039.png", alt: "Mining", label: "Mining", active: false, href: "/mining" },
            { src: "https://ext.same-assets.com/590002659/3073358967.png", alt: "Service", label: "Service", active: false, href: "/service" },
            { src: "https://ext.same-assets.com/590002659/855995434.png", alt: "Invite", label: "Invite", active: true, href: "/invite" },
            { src: "https://ext.same-assets.com/590002659/2669583638.png", alt: "User", label: "User", active: false, href: "/user" },
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
