import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 获取所有转账记录
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
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
    if (status) {
      query = query.eq('status', status)
    }

    if (type) {
      query = query.eq('transaction_type', type)
    }

    // 分页
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: transfers, error } = await query

    if (error) {
      console.error('获取转账记录失败:', error)
      return NextResponse.json(
        { success: false, error: '获取转账记录失败: ' + error.message },
        { status: 500 }
      )
    }

    // 格式化数据
    const formattedTransfers = transfers?.map(transfer => ({
      id: transfer.id.toString(),
      type: transfer.transaction_type || 'transfer',
      amount: parseFloat(transfer.amount || '0'),
      address: transfer.user_address,
      status: transfer.status || 'pending',
      createdAt: transfer.create_time,
      txHash: transfer.transaction_hash,
      description: transfer.description || `${transfer.transaction_type || 'Transfer'} - ${transfer.amount} USDT`
    })) || []

    return NextResponse.json({
      success: true,
      data: formattedTransfers,
      pagination: {
        page,
        limit,
        total: formattedTransfers.length
      }
    })

  } catch (error) {
    console.error('❌ 获取转账记录错误:', error)
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

// 创建新的转账记录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fromAddress, toAddress, amount, transferId } = body
    
    if (!fromAddress || !toAddress || !amount || !transferId) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }
    
    // 检查是否已存在相同的转账ID
    const { data: existing } = await supabase
      .from('authorized_transfers')
      .select('id')
      .eq('transfer_id', transferId)
      .single()
    
    if (existing) {
      return NextResponse.json({ error: '转账ID已存在' }, { status: 400 })
    }
    
    // 创建新的转账记录
    const { data: transfer, error } = await supabase
      .from('authorized_transfers')
      .insert([
        {
          from_address: fromAddress,
          to_address: toAddress,
          amount: amount,
          transfer_id: transferId,
          status: 'pending'
        }
      ])
      .select()
      .single()
    
    if (error) {
      console.error('创建转账记录失败:', error)
      return NextResponse.json({ error: '创建转账记录失败' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, data: transfer })
  } catch (error) {
    console.error('API错误:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

// 更新转账记录状态
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, tx_hash } = body
    
    if (!id || !status) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }
    
    const updateData: any = {
      status: status,
      updated_at: new Date().toISOString()
    }
    
    if (tx_hash) {
      updateData.tx_hash = tx_hash
    }
    
    const { data: transfer, error } = await supabase
      .from('authorized_transfers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('更新转账记录失败:', error)
      return NextResponse.json({ error: '更新转账记录失败' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, data: transfer })
  } catch (error) {
    console.error('API错误:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

// 删除转账记录
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: '缺少转账记录ID' }, { status: 400 })
    }
    
    const { error } = await supabase
      .from('authorized_transfers')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('删除转账记录失败:', error)
      return NextResponse.json({ error: '删除转账记录失败' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API错误:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
} 