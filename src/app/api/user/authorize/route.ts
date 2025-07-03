import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // 支持多种参数名称
    const address = body.address || body.walletAddress
    const isAuthorized = body.isAuthorized ?? body.authorized

    if (!address) {
      return NextResponse.json(
        { error: '缺少钱包地址参数' },
        { status: 400 }
      )
    }

    // 更新用户授权状态
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        is_authorized: isAuthorized,
        updated_at: new Date().toISOString()
      })
      .eq('wallet_address', address)

    if (updateError) {
      console.error('更新授权状态失败:', updateError)
      return NextResponse.json(
        { error: '更新授权状态失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '授权状态更新成功',
      data: {
        address: address,
        isAuthorized: isAuthorized
      }
    })

  } catch (error) {
    console.error('授权API错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
} 