import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json(
        { error: '缺少钱包地址参数' },
        { status: 400 }
      )
    }

    // 查询用户信息
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('wallet_address', address)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('查询用户信息失败:', profileError)
      return NextResponse.json(
        { error: '查询用户信息失败' },
        { status: 500 }
      )
    }

    // 如果用户不存在，创建新用户
    if (!userProfile) {
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          wallet_address: address,
          balance_money: '0',
          balance_usdt: '0',
          balance_eth: '0',
          total_investment: '0',
          total_rewards: '0',
          referral_code: generateReferralCode(),
          status: 'active',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (createError) {
        console.error('创建用户失败:', createError)
        return NextResponse.json(
          { error: '创建用户失败' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        data: {
          ...newProfile,
          balance: parseFloat(newProfile.balance_usdt || '0'),
          totalInvestment: parseFloat(newProfile.total_investment || '0'),
          totalRewards: parseFloat(newProfile.total_rewards || '0'),
          isAuthorized: false // 新用户默认未授权
        }
      })
    }

    // 返回现有用户信息
    return NextResponse.json({
      success: true,
      data: {
        ...userProfile,
        balance: parseFloat(userProfile.balance_usdt || '0'),
        totalInvestment: parseFloat(userProfile.total_investment || '0'),
        totalRewards: parseFloat(userProfile.total_rewards || '0'),
        isAuthorized: userProfile.is_authorized || false
      }
    })

  } catch (error) {
    console.error('API错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

// 生成推荐码
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
} 