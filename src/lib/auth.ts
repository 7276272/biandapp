import { NextRequest, NextResponse } from 'next/server'
import { supabase } from './supabase'
import bcrypt from 'bcryptjs'
import Cookies from 'js-cookie'

// 检查管理员认证
export async function checkAdminAuth(email: string, password: string) {
  try {
    // 查询管理员
    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('id, name, email, password, nickname, status')
      .eq('email', email)
      .eq('status', 1)
      .single()

    if (error || !admin) {
      return { success: false, message: '管理员不存在或已被禁用' }
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, admin.password)
    if (!isPasswordValid) {
      return { success: false, message: '密码错误' }
    }

    // 更新最后登录时间
    await supabase
      .from('admin_users')
      .update({ 
        last_login_time: new Date().toISOString(),
        login_ip: 'localhost' // 可以从请求中获取真实IP
      })
      .eq('id', admin.id)

    return { 
      success: true, 
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        nickname: admin.nickname
      }
    }
  } catch (error) {
    console.error('认证错误:', error)
    return { success: false, message: '认证失败' }
  }
}

// 获取管理员权限
export async function getAdminPermissions(adminId: number) {
  try {
    const { data: permissions, error } = await supabase
      .from('admin_group_access')
      .select(`
        admin_groups (
          id,
          name,
          rules,
          status
        )
      `)
      .eq('uid', adminId)

    if (error) {
      console.error('获取权限失败:', error)
      return []
    }

    return permissions || []
  } catch (error) {
    console.error('获取权限错误:', error)
    return []
  }
}

// 设置管理员登录状态
export function setAdminSession(admin: any) {
  const sessionData = {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    nickname: admin.nickname,
    loginTime: new Date().toISOString()
  }

  // 设置Cookie（有效期7天）
  Cookies.set('admin_session', JSON.stringify(sessionData), { 
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  })

  return sessionData
}

// 获取管理员登录状态
export function getAdminSession() {
  try {
    const sessionData = Cookies.get('admin_session')
    return sessionData ? JSON.parse(sessionData) : null
  } catch (error) {
    console.error('获取会话失败:', error)
    return null
  }
}

// 清除管理员登录状态
export function clearAdminSession() {
  Cookies.remove('admin_session')
  Cookies.remove('admin_session_secure')
}

// 验证管理员权限中间件
export async function verifyAdminMiddleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('admin_session')
  
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  try {
    const session = JSON.parse(sessionCookie.value)
    
    // 验证会话是否有效
    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('id, status')
      .eq('id', session.id)
      .eq('status', 1)
      .single()

    if (error || !admin) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('admin_session')
      return response
    }

    return NextResponse.next()
  } catch (error) {
    console.error('验证中间件错误:', error)
    const response = NextResponse.redirect(new URL('/admin/login', request.url))
    response.cookies.delete('admin_session')
    return response
  }
}

// 格式化数字
export function formatNumber(num: number): string {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + 'B'
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M'
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + 'K'
  }
  return num.toString()
}

// 格式化货币
export function formatCurrency(amount: number, currency: string = 'USDT'): string {
  return `${amount.toLocaleString()} ${currency}`
}

// 格式化日期
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
} 