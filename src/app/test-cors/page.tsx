'use client'

import { useState } from 'react'
import axios from 'axios'

export default function TestCorsPage() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const testEndpoints = [
    { name: 'CORS测试', url: 'https://us4dt.com/test_cors.php' },
    { name: '获取货币配置', url: 'https://us4dt.com/api/xhsk/getCurrency.html' },
    { name: '获取统计数据', url: 'https://us4dt.com/api/xhsk/getStatistics.html' },
    { name: '获取文章列表', url: 'https://us4dt.com/api/xhsk/articles.html' },
    { name: '获取用户信息', url: 'https://us4dt.com/api/xhsk/userinfo.html' }
  ]

  const testCorsConnection = async (endpoint: any) => {
    try {
      console.log(`🔄 正在测试 ${endpoint.name}...`)
      
      const response = await axios.get(endpoint.url, {
        params: {
          address: '0x1234567890abcdef1234567890abcdef12345678',
          language: 'en',
          timestamp: Date.now()
        },
        timeout: 10000
      })
      
      return {
        name: endpoint.name,
        url: endpoint.url,
        status: 'success',
        data: response.data,
        error: null
      }
    } catch (error: any) {
      console.error(`❌ ${endpoint.name} 测试失败:`, error)
      
      return {
        name: endpoint.name,
        url: endpoint.url,
        status: 'error',
        data: null,
        error: error.message
      }
    }
  }

  const runAllTests = async () => {
    setLoading(true)
    setResults([])
    
    try {
      const testPromises = testEndpoints.map(endpoint => testCorsConnection(endpoint))
      const testResults = await Promise.all(testPromises)
      setResults(testResults)
    } catch (error) {
      console.error('批量测试失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">CORS 连接测试</h1>
      
      <div className="mb-6">
        <button
          onClick={runAllTests}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? '测试中...' : '开始测试'}
        </button>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              result.status === 'success' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{result.name}</h3>
              <span
                className={`px-2 py-1 text-xs rounded ${
                  result.status === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {result.status === 'success' ? '✅ 成功' : '❌ 失败'}
              </span>
            </div>
            
            <div className="text-sm text-gray-600 mb-2">
              URL: {result.url}
            </div>
            
            {result.error && (
              <div className="text-sm text-red-600 mb-2">
                错误: {result.error}
              </div>
            )}
            
            {result.data && (
              <details className="text-sm">
                <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                  查看响应数据
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>
      
      {results.length === 0 && !loading && (
        <div className="text-center text-gray-500 py-8">
          点击"开始测试"按钮来测试CORS连接
        </div>
      )}
    </div>
  )
} 