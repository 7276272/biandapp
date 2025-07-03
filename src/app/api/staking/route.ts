import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, address, amount, txHash } = body

    if (!address || !amount) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }

    if (action === 'stake') {
      return await handleStake(address, amount, txHash)
    } else if (action === 'withdraw') {
      return await handleWithdraw(address, amount)
    } else {
      return NextResponse.json(
        { error: '无效的操作类型' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('质押API错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

// 处理质押
async function handleStake(address: string, amount: string, txHash?: string) {
  try {
    // 查询用户信息
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('wallet_address', address)
      .single()

    if (userError) {
      console.error('查询用户失败:', userError)
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    const currentBalance = parseFloat(userProfile.balance_usdt || '0')
    const currentInvestment = parseFloat(userProfile.total_investment || '0')
    const stakeAmount = parseFloat(amount)

    // 创建质押记录
    const { data: stakingRecord, error: stakingError } = await supabase
      .from('user_investments')
      .insert({
        user_id: userProfile.id,
        wallet_address: address,
        amount: amount,
        currency: 'USDT',
        type: 'stake',
        status: 'confirmed',
        transaction_hash: txHash || `stake_${Date.now()}`,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (stakingError) {
      console.error('创建质押记录失败:', stakingError)
      return NextResponse.json(
        { error: '创建质押记录失败' },
        { status: 500 }
      )
    }

    // 更新用户余额和投资总额
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        balance_usdt: (currentBalance + stakeAmount).toString(),
        total_investment: (currentInvestment + stakeAmount).toString(),
        updated_at: new Date().toISOString()
      })
      .eq('wallet_address', address)

    if (updateError) {
      console.error('更新用户余额失败:', updateError)
      return NextResponse.json(
        { error: '更新用户余额失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '质押成功',
      data: {
        recordId: stakingRecord.id,
        amount: amount,
        newBalance: (currentBalance + stakeAmount).toString()
      }
    })

  } catch (error) {
    console.error('质押处理错误:', error)
    return NextResponse.json(
      { error: '质押处理失败' },
      { status: 500 }
    )
  }
}

// 处理提取
async function handleWithdraw(address: string, amount: string) {
  try {
    // 查询用户信息
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('wallet_address', address)
      .single()

    if (userError) {
      console.error('查询用户失败:', userError)
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    const currentBalance = parseFloat(userProfile.balance_usdt || '0')
    const withdrawAmount = parseFloat(amount)

    // 检查余额是否充足
    if (currentBalance < withdrawAmount) {
      return NextResponse.json(
        { error: '余额不足' },
        { status: 400 }
      )
    }

    // 创建提取记录
    const { data: withdrawRecord, error: withdrawError } = await supabase
      .from('user_investments')
      .insert({
        user_id: userProfile.id,
        wallet_address: address,
        amount: amount,
        currency: 'USDT',
        type: 'withdraw',
        status: 'pending',
        transaction_hash: `withdraw_${Date.now()}`,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (withdrawError) {
      console.error('创建提取记录失败:', withdrawError)
      return NextResponse.json(
        { error: '创建提取记录失败' },
        { status: 500 }
      )
    }

    // 更新用户余额
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        balance_usdt: (currentBalance - withdrawAmount).toString(),
        updated_at: new Date().toISOString()
      })
      .eq('wallet_address', address)

    if (updateError) {
      console.error('更新用户余额失败:', updateError)
      return NextResponse.json(
        { error: '更新用户余额失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '提取申请已提交',
      data: {
        recordId: withdrawRecord.id,
        amount: amount,
        newBalance: (currentBalance - withdrawAmount).toString(),
        status: 'pending'
      }
    })

  } catch (error) {
    console.error('提取处理错误:', error)
    return NextResponse.json(
      { error: '提取处理失败' },
      { status: 500 }
    )
  }
} 