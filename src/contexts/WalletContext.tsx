'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useAccount, useBalance, useDisconnect } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'

interface WalletContextType {
  // 账户信息
  account: string | undefined
  isConnected: boolean
  chainId: number | undefined
  balance: string | undefined
  
  // 操作方法
  connect: () => void
  disconnect: () => void
  
  // 加载状态
  isLoading: boolean
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const { address, isConnected, chain } = useAccount()
  const { data: balance } = useBalance({
    address: address,
  })
  const { disconnect } = useDisconnect()
  const { open } = useAppKit()

  const contextValue: WalletContextType = {
    account: address,
    isConnected,
    chainId: chain?.id,
    balance: balance?.formatted,
    connect: () => open(),
    disconnect,
    isLoading: false
  }

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
