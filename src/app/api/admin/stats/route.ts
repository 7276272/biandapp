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

    // 获取活跃用户数（最近30天创建的用户，因为缺少last_login_time字段）
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { data: activeUsersData, error: activeUsersError } = await supabase
      .from('users')
      .select('id', { count: 'exact' })
      .gte('create_time', thirtyDaysAgo)

    if (activeUsersError) {
      console.error('获取活跃用户数据失败:', activeUsersError)
    }

    // 获取总资产 - 从user_profiles表获取
    const { data: profilesData, error: profilesError } = await supabase
      .from('user_profiles')
      .select('balance_usdt, balance_money, total_investment')

    if (profilesError) {
      console.error('获取用户资料失败:', profilesError)
    }

    let totalBalance = 0
    if (profilesData) {
      totalBalance = profilesData.reduce((sum, profile) => {
        const usdt = parseFloat(profile.balance_usdt || '0')
        const money = parseFloat(profile.balance_money || '0')
        const investment = parseFloat(profile.total_investment || '0')
        return sum + usdt + money + investment
      }, 0)
    }

    // 获取交易总数 - 从authorized_transfers表获取
    const { data: transfersData, error: transfersError } = await supabase
      .from('authorized_transfers')
      .select('id', { count: 'exact' })

    if (transfersError) {
      console.error('获取转账数据失败:', transfersError)
    }

    const stats = {
      totalUsers: usersData?.length || 0,
      activeUsers: activeUsersData?.length || 0,
      totalBalance: Math.round(totalBalance * 100) / 100, // 保留2位小数
      totalTransactions: transfersData?.length || 0
    }

    console.log('✅ 统计数据获取成功:', stats)

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('❌ 获取统计数据错误:', error)
    return NextResponse.json(
      { success: false, message: '获取统计数据失败' },
      { status: 500 }
    )
  }
} 