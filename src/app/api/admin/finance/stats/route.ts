import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // 获取用户总余额
    const { data: profilesData, error: profilesError } = await supabase
      .from('user_profiles')
      .select('balance_usdt, balance_money, total_investment, total_rewards')

    if (profilesError) {
      console.error('获取用户资料失败:', profilesError)
    }

    // 计算总余额
    let totalBalance = 0
    let totalInvestment = 0
    let totalRewards = 0

    if (profilesData) {
      profilesData.forEach(profile => {
        totalBalance += parseFloat(profile.balance_usdt || '0') + parseFloat(profile.balance_money || '0')
        totalInvestment += parseFloat(profile.total_investment || '0')
        totalRewards += parseFloat(profile.total_rewards || '0')
      })
    }

    // 获取交易统计
    const { data: transfersData, error: transfersError } = await supabase
      .from('authorized_transfers')
      .select('amount, transaction_type, status, create_time')

    if (transfersError) {
      console.error('获取转账数据失败:', transfersError)
    }

    let totalDeposits = 0
    let totalWithdrawals = 0
    let pendingTransactions = 0
    let todayRevenue = 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (transfersData) {
      transfersData.forEach(transfer => {
        const amount = parseFloat(transfer.amount || '0')
        const transferDate = new Date(transfer.create_time)

        if (transfer.transaction_type === 'deposit' || transfer.transaction_type === 'stake') {
          totalDeposits += amount
          
          // 计算今日收入
          if (transferDate >= today) {
            todayRevenue += amount
          }
        } else if (transfer.transaction_type === 'withdrawal') {
          totalWithdrawals += amount
        }

        if (transfer.status === 'pending') {
          pendingTransactions += 1
        }
      })
    }

    // 计算月收入（简化计算，使用总投资的10%作为示例）
    const monthlyRevenue = totalInvestment * 0.1

    const stats = {
      totalBalance: Math.round(totalBalance * 100) / 100,
      totalDeposits: Math.round(totalDeposits * 100) / 100,
      totalWithdrawals: Math.round(totalWithdrawals * 100) / 100,
      pendingTransactions,
      todayRevenue: Math.round(todayRevenue * 100) / 100,
      monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
      totalInvestment: Math.round(totalInvestment * 100) / 100,
      totalRewards: Math.round(totalRewards * 100) / 100
    }

    console.log('✅ 财务统计数据获取成功:', stats)

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('❌ 获取财务统计数据错误:', error)
    return NextResponse.json(
      { success: false, error: '获取财务统计数据失败' },
      { status: 500 }
    )
  }
} 