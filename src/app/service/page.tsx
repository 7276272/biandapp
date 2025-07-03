'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { WalletStatus } from '@/components/WalletConnector'
import { EnhancedButton } from '@/components/EnhancedButton'
import { PriceChart } from '@/components/charts/PriceChart'
import { MiningPerformanceChart, HashRateChart } from '@/components/charts/MiningChart'
import { ParticleBackground } from '@/components/ParticleBackground'
import Link from 'next/link'
import {
  Zap,
  Shield,
  TrendingUp,
  Users,
  Award,
  Settings,
  BarChart3,
  Wallet,
  Clock,
  DollarSign
} from 'lucide-react'

export default function ServicePage() {
  const services = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Mining Pool Services",
      description: "Join our high-performance mining pools with competitive fees and reliable payouts.",
      features: ["Low 1% fee", "Daily payouts", "99.9% uptime", "Global servers"],
      price: "1% Fee",
      badge: "Popular"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Staking",
      description: "Stake your ETH with institutional-grade security and earn steady rewards.",
      features: ["4.5% APY", "No lock-up period", "Insurance covered", "24/7 monitoring"],
      price: "4.5% APY",
      badge: "Secure"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "DeFi Trading",
      description: "Access advanced trading tools and automated strategies for maximum profits.",
      features: ["Auto-trading bots", "Low latency", "Advanced charts", "API access"],
      price: "0.1% Fee",
      badge: "Advanced"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Group Mining",
      description: "Combine resources with other miners for better efficiency and lower costs.",
      features: ["Shared hardware", "Split profits", "Reduced costs", "Group management"],
      price: "2% Fee",
      badge: "Community"
    }
  ]

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Real-time Analytics",
      description: "Monitor your mining performance with live charts and detailed statistics."
    },
    {
      icon: <Wallet className="w-6 h-6" />,
      title: "Multi-Wallet Support",
      description: "Connect multiple wallets and manage all your assets in one place."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Get help anytime with our dedicated support team and community."
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Flexible Payouts",
      description: "Choose from daily, weekly, or monthly payout schedules."
    }
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
        <section className="text-center mb-12 slide-in-up">
          <h1 className="text-4xl font-bold mb-4 gold-text">Mining Services</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Comprehensive cryptocurrency mining and DeFi services for maximum profitability
          </p>

          {/* Service Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="frosted-glass floating">
              <CardContent className="p-4 text-center">
                <Award className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </CardContent>
            </Card>
            <Card className="frosted-glass floating" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-sm text-muted-foreground">Active Miners</div>
              </CardContent>
            </Card>
            <Card className="frosted-glass floating" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <div className="text-2xl font-bold text-white">$2.5M</div>
                <div className="text-sm text-muted-foreground">Daily Volume</div>
              </CardContent>
            </Card>
            <Card className="frosted-glass floating" style={{ animationDelay: '0.6s' }}>
              <CardContent className="p-4 text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-sm text-muted-foreground">Secure</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Services Grid */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 gold-text">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <Card key={service.title} className="frosted-glass hover:scale-105 transition-all duration-300 floating" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-primary">{service.icon}</div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </div>
                    <Badge className="bg-primary text-primary-foreground">
                      {service.badge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{service.description}</p>

                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-4 border-t border-border/20">
                    <div className="text-2xl font-bold text-primary">{service.price}</div>
                    <EnhancedButton className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Get Started
                    </EnhancedButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Performance Charts */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 gold-text">Performance Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="frosted-glass">
              <CardHeader>
                <CardTitle>Mining Performance (7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <MiningPerformanceChart />
              </CardContent>
            </Card>

            <Card className="frosted-glass">
              <CardHeader>
                <CardTitle>Pool Hash Rate Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <HashRateChart />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 gold-text">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={feature.title} className="frosted-glass text-center floating" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="text-primary mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Price Chart Section */}
        <section className="mb-12">
          <Card className="frosted-glass">
            <CardHeader>
              <CardTitle className="text-center">Ethereum Price (7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <PriceChart coinId="ethereum" days={7} height={400} />
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="frosted-glass">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4 gold-text">Ready to Start Mining?</h2>
              <p className="text-xl text-muted-foreground mb-6">
                Join thousands of miners earning passive income with our platform
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <EnhancedButton size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Start Mining Now
                </EnhancedButton>
                <EnhancedButton variant="outline" size="lg">
                  View Documentation
                </EnhancedButton>
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
            { src: "https://ext.same-assets.com/590002659/3073358967.png", alt: "Service", label: "Service", active: true, href: "/service" },
            { src: "https://ext.same-assets.com/590002659/855995434.png", alt: "Invite", label: "Invite", active: false, href: "/invite" },
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
