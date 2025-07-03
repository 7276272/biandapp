'use client'

import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { arbitrum, mainnet, bscTestnet, bsc } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { ReactNode, useEffect } from 'react'
import { initWalletUICustomizer } from '@/lib/wallet-ui-customizer'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId from https://cloud.reown.com
const projectId = 'c482c3062b88c6cc75e14712c5249b37'

// 2. Create a metadata object - optional
const metadata = {
  name: 'BSC Pool DeFi Mining Platform',
  description: '安全、高效、透明的去中心化挖矿平台',
  url: 'https://us4dt.com', // origin must match your domain & subdomain
  icons: ['https://assets.reown.com/reown-profile-pic.png']
}

// 3. Set the networks - 包含 BSC 网络
const networks = [bsc, mainnet, arbitrum, bscTestnet]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
})

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

interface AppKitProviderProps {
  children: ReactNode
}

export function AppKitProvider({ children }: AppKitProviderProps) {
  // 初始化钱包UI定制器
  useEffect(() => {
    const cleanup = initWalletUICustomizer();
    
    // 组件卸载时清理
    return cleanup;
  }, []);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

// 导出 wagmi adapter 以便其他组件使用
export { wagmiAdapter } 