import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // 获取用户总数
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id', { count: 'exact' })

    if (usersError) {
      console.error('获取用户数据失败:', usersError)
    }

    // 获取活跃用户数（最近30天有登录的用户）
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { data: activeUsersData, error: activeUsersError } = await supabase
      .from('users')
      .select('id', { count: 'exact' })
      .gte('last_login_time', thirtyDaysAgo)

    if (activeUsersError) {
      console.error('获取活跃用户数据失败:', activeUsersError)
    }

    // 获取总资产
    const { data: balanceData, error: balanceError } = await supabase
      .from('user_balances')
      .select('balance')

    if (balanceError) {
      console.error('获取余额数据失败:', balanceError)
    }

    const totalBalance = balanceData?.reduce((sum, item) => sum + item.balance, 0) || 0

    // 获取交易总数
    const { data: rechargeData, error: rechargeError } = await supabase
      .from('user_recharge')
      .select('id', { count: 'exact' })

    const { data: withdrawData, error: withdrawError } = await supabase
      .from('user_withdraw')
      .select('id', { count: 'exact' })

    if (rechargeError) {
      console.error('获取充值数据失败:', rechargeError)
    }

    if (withdrawError) {
      console.error('获取提现数据失败:', withdrawError)
    }

    const totalTransactions = (rechargeData?.length || 0) + (withdrawData?.length || 0)

    const stats = {
      totalUsers: usersData?.length || 0,
      activeUsers: activeUsersData?.length || 0,
      totalBalance: totalBalance,
      totalTransactions: totalTransactions
    }

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('获取统计数据错误:', error)
    return NextResponse.json(
      { success: false, message: '获取统计数据失败' },
      { status: 500 }
    )
  }
} 