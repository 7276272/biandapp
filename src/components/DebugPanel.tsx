'use client'

import { useState } from 'react'
import { useWallet } from '@/contexts/WalletContext'
import { NetworkStatus } from './NetworkStatus'

interface DebugPanelProps {
  showStakingModal?: boolean
  onToggleModal?: () => void
}

export function DebugPanel({ showStakingModal, onToggleModal }: DebugPanelProps) {
  const [showDebug, setShowDebug] = useState(false)
  const [testResult, setTestResult] = useState('')
  const { account, isConnected } = useWallet()

  const testAPI = async () => {
    if (!account) {
      setTestResult('❌ 请先连接钱包')
      return
    }

    try {
      setTestResult('🧪 正在测试API...')
      const response = await fetch(`/api/user/info?address=${account}`)
      const data = await response.json()
      
      if (response.ok) {
        setTestResult('✅ API测试成功:\n' + JSON.stringify(data, null, 2))
      } else {
        setTestResult('❌ API测试失败:\n' + JSON.stringify(data, null, 2))
      }
    } catch (error: any) {
      setTestResult('❌ 请求失败: ' + error.message)
    }
  }

  const testModal = () => {
    if (onToggleModal) {
      onToggleModal()
      setTestResult('✅ 模态框切换成功')
    } else {
      setTestResult('❌ 模态框切换函数未定义')
    }
  }

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-20 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs z-50"
      >
        调试
      </button>
    )
  }

  return (
    <div className="fixed bottom-20 right-4 bg-black/90 border border-yellow-500/20 rounded-lg p-4 max-w-sm z-50 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-yellow-500 font-bold">调试面板</h3>
        <button
          onClick={() => setShowDebug(false)}
          className="text-white hover:text-yellow-500"
        >
          ×
        </button>
      </div>
      
      {/* 网络状态 */}
      <NetworkStatus />
      
      <div className="space-y-2 text-sm">
        <div>
          <span className="text-gray-400">钱包连接:</span>
          <span className={isConnected ? 'text-green-500' : 'text-red-500'}>
            {isConnected ? '✅ 已连接' : '❌ 未连接'}
          </span>
        </div>
        
        <div>
          <span className="text-gray-400">钱包地址:</span>
          <div className="text-white text-xs break-all">
            {account || '未连接'}
          </div>
        </div>
        
        <div>
          <span className="text-gray-400">模态框状态:</span>
          <span className={showStakingModal ? 'text-green-500' : 'text-red-500'}>
            {showStakingModal ? '✅ 显示' : '❌ 隐藏'}
          </span>
        </div>
        
        <div className="space-y-1">
          <button
            onClick={testAPI}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs"
          >
            测试API
          </button>
          
          <button
            onClick={testModal}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded text-xs"
          >
            切换模态框
          </button>
        </div>
        
        {testResult && (
          <div className="mt-2 p-2 bg-gray-900 rounded text-xs">
            <pre className="text-white whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}
      </div>
    </div>
  )
} 