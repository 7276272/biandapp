import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address') || searchParams.get('walletAddress')

    if (!address) {
      return NextResponse.json(
        { error: '缺少钱包地址参数' },
        { status: 400 }
      )
    }

    console.log('🔍 查询用户信息，地址:', address)

    // 先查询users表检查用户是否存在
    const { data: existingUsers, error: userError } = await supabase
      .from('users')
      .select('id, wallet_address, nickname, email, status, create_time, update_time')
      .eq('wallet_address', address)
      .order('create_time', { ascending: false })

    if (userError) {
      console.error('❌ 查询users表失败:', userError)
      return NextResponse.json(
        { error: '查询用户失败: ' + userError.message },
        { status: 500 }
      )
    }

    let userId: number
    let userData: any

    // 如果有多条记录，使用最新的记录
    const existingUser = existingUsers && existingUsers.length > 0 ? existingUsers[0] : null

    // 如果用户不存在，创建新用户
    if (!existingUser) {
      console.log('📝 创建新用户记录...')
      
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert({
          name: `用户${address.slice(-6)}`,
          password: 'wallet_user',
          nickname: `用户${address.slice(-6)}`,
          wallet_address: address,
          recommend_code: generateReferralCode(),
          status: 1,
          wallet_type: 'metamask'
        })
        .select('id, wallet_address, nickname, email, status, create_time, update_time')
        .single()

      if (createUserError) {
        console.error('❌ 创建用户失败:', createUserError)
        return NextResponse.json(
          { error: '创建用户失败: ' + createUserError.message },
          { status: 500 }
        )
      }

      userId = newUser.id
      userData = newUser
      console.log('✅ 用户创建成功，ID:', userId)
    } else {
      userId = existingUser.id
      userData = existingUser
      console.log('✅ 找到现有用户，ID:', userId)
    }

    // 查询user_profiles记录
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (profileError) {
      console.error('❌ 查询用户资料失败:', profileError)
      return NextResponse.json(
        { error: '查询用户资料失败: ' + profileError.message },
        { status: 500 }
      )
    }

    let profileData: any

    // 如果user_profiles记录不存在，创建它
    if (!userProfile) {
      console.log('📝 创建用户资料记录...')
      
      const { data: newProfile, error: createProfileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          user_address: address,
          nickname: userData.nickname || `用户${address.slice(-6)}`,
          balance_money: 0,
          balance_usdt: 0,
          balance_eth: 0,
          total_investment: 0,
          total_rewards: 0,
          referral_code: generateReferralCode(),
          is_authorized: false,
          status: 1
        })
        .select('*')
        .single()

      if (createProfileError) {
        console.error('❌ 创建用户资料失败:', createProfileError)
        return NextResponse.json(
          { error: '创建用户资料失败: ' + createProfileError.message },
          { status: 500 }
        )
      }

      profileData = newProfile
      console.log('✅ 用户资料创建成功')
    } else {
      profileData = userProfile
      console.log('✅ 找到现有用户资料')
    }

    // 构建返回数据
    const responseData = {
      id: userData.id,
      address: address,
      wallet_address: address,
      nickname: profileData.nickname || userData.nickname,
      email: userData.email || '',
      balance: parseFloat(profileData.balance_usdt || '0'),
      totalInvestment: parseFloat(profileData.total_investment || '0'),
      totalRewards: parseFloat(profileData.total_rewards || '0'),
      isAuthorized: profileData.is_authorized || false,
      status: userData.status,
      createTime: userData.create_time,
      updateTime: profileData.update_time || userData.update_time
    }

    console.log('✅ 用户信息查询成功:', responseData.nickname)

    return NextResponse.json({
      success: true,
      data: responseData
    })

  } catch (error: any) {
    console.error('❌ API错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误: ' + error.message },
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