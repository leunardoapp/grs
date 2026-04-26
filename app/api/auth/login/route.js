import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'ایمیل و رمز عبور الزامی است' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json(
        { error: 'ایمیل یا رمز عبور نادرست' },
        { status: 401 }
      )
    }

    const passwordValid = await bcrypt.compare(password, user.password)

    if (!passwordValid) {
      return NextResponse.json(
        { error: 'ایمیل یا رمز عبور نادرست' },
        { status: 401 }
      )
    }

    // Set cookie (in a real app, you'd use proper session management)
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })

    response.cookies.set('auth_token', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'خطایی رخ داد' },
      { status: 500 }
    )
  }
}
