import { NextRequest, NextResponse } from 'next/server'
import { checkAdminAuth, setAdminSession } from '@/lib/auth'

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

    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      )
    }

    // 设置会话
    const sessionData = setAdminSession(authResult.admin)

    // 创建响应并设置Cookie
    const response = NextResponse.json({
      success: true,
      message: '登录成功',
      admin: sessionData
    })

    // 设置HTTP-Only Cookie
    response.cookies.set('admin_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7天
    })

    return response
  } catch (error) {
    console.error('登录API错误:', error)
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    )
  }
} 