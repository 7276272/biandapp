import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const offset = parseInt(searchParams.get('offset') || '0')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    let query = supabase
      .from('users')
      .select('*')
      .order('create_time', { ascending: false })
      .range(offset, offset + limit - 1)

    // 如果有搜索条件
    if (search) {
      query = query.or(`address.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const { data: users, error } = await query

    if (error) {
      console.error('获取用户列表失败:', error)
      return NextResponse.json(
        { success: false, message: '获取用户列表失败' },
        { status: 500 }
      )
    }

    // 获取总数
    let countQuery = supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (search) {
      countQuery = countQuery.or(`address.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const { count, error: countError } = await countQuery

    if (countError) {
      console.error('获取用户总数失败:', countError)
    }

    return NextResponse.json({
      success: true,
      users: users || [],
      total: count || 0
    })

  } catch (error) {
    console.error('获取用户列表错误:', error)
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    )
  }
} 