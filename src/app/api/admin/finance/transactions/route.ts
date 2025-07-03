import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    let query = supabase
      .from('authorized_transfers')
      .select(`
        id,
        user_address,
        amount,
        status,
        transaction_type,
        transaction_hash,
        create_time,
        update_time,
        network,
        description
      `)
      .order('create_time', { ascending: false })

    // 添加筛选条件
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (type && type !== 'all') {
      query = query.eq('transaction_type', type)
    }

    // 分页
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: transfers, error } = await query

    if (error) {
      console.error('获取交易记录失败:', error)
      return NextResponse.json(
        { success: false, error: '获取交易记录失败: ' + error.message },
        { status: 500 }
      )
    }

    // 格式化数据
    const formattedTransactions = transfers?.map(transfer => {
      const transactionType = transfer.transaction_type || 'transfer'
      let displayType: 'deposit' | 'withdrawal' | 'staking' | 'reward' = 'deposit'
      
      switch (transactionType) {
        case 'deposit':
        case 'stake':
          displayType = 'deposit'
          break
        case 'withdrawal':
        case 'withdraw':
          displayType = 'withdrawal'
          break
        case 'staking':
          displayType = 'staking'
          break
        case 'reward':
          displayType = 'reward'
          break
        default:
          displayType = 'deposit'
      }

      return {
        id: transfer.id.toString(),
        type: displayType,
        amount: parseFloat(transfer.amount || '0'),
        address: transfer.user_address || '',
        status: transfer.status || 'pending',
        createdAt: transfer.create_time || new Date().toISOString(),
        txHash: transfer.transaction_hash,
        description: transfer.description || `${transactionType} - ${transfer.amount || 0} USDT`
      }
    }) || []

    console.log(`✅ 获取到 ${formattedTransactions.length} 条交易记录`)

    return NextResponse.json({
      success: true,
      data: formattedTransactions,
      pagination: {
        page,
        limit,
        total: formattedTransactions.length,
        hasMore: formattedTransactions.length === limit
      }
    })

  } catch (error) {
    console.error('❌ 获取交易记录错误:', error)
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    )
  }
} 