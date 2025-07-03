import { NextRequest, NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: '邮箱和密码不能为空' },
        { status: 400 }
      )
    }

    // 验证管理员凭据
    const authResult = await checkAdminAuth(email, password)

    if (!authResult.success || !authResult.admin) {
      return NextResponse.json(
        { success: false, message: authResult.message || '认证失败' },
        { status: 401 }
      )
    }

    // 创建会话数据
    const sessionData = {
      id: authResult.admin.id,
      name: authResult.admin.name,
      email: authResult.admin.email,
      nickname: authResult.admin.nickname,
      loginTime: new Date().toISOString()
    }

    // 创建响应
    const response = NextResponse.json({
      success: true,
      message: '登录成功',
      admin: sessionData
    })

    // 设置可被客户端读取的Cookie（用于客户端判断登录状态）
    response.cookies.set('admin_session', JSON.stringify(sessionData), {
      httpOnly: false, // 改为false，使客户端JavaScript可以读取
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7天
      path: '/'
    })

    // 同时设置HTTP-Only Cookie（用于服务器端验证）
    response.cookies.set('admin_session_secure', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7天
      path: '/'
    })

    console.log('✅ 管理员登录成功:', authResult.admin.email)
    return response
  } catch (error) {
    console.error('❌ 登录API错误:', error)
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    )
  }
} 