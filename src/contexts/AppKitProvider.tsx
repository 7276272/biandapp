'use client'

import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { bsc, bscTestnet } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { cookieToInitialState } from 'wagmi'
import { ReactNode } from 'react'

// 配置查询客户端
const queryClient = new QueryClient()

// 项目ID - 使用有效的项目ID
const projectId = 'c482c3062b88c6cc75e14712c5249b37'

// 创建模态配置
const metadata = {
  name: 'BSC Pool DApp',
  description: 'Decentralized Mining Pool on BSC',
  url: 'https://reown.com/appkit',
  icons: ['https://assets.reown.com/reown-profile-pic.png']
}

// 创建 Wagmi 适配器
const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  networks: [bsc, bscTestnet],
  projectId
})

// 创建 AppKit 实例
createAppKit({
  adapters: [wagmiAdapter],
  networks: [bsc, bscTestnet],
  metadata,
  projectId,
  features: {
    analytics: true,
    email: false,
    socials: false
  }
})

interface AppKitProviderProps {
  children: ReactNode
  cookies?: string
}

export default function AppKitProvider({ children, cookies }: AppKitProviderProps) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
} 