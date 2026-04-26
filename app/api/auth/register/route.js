import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req) {
  try {
    const body = await req.json()
    const { name, email, password, confirmPassword } = body

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'تمام فیلدها الزامی است' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'رمزهای عبور مطابقت ندارند' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return NextResponse.json(
        { error: 'این ایمیل قبلاً ثبت شده است' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'CUSTOMER',
      },
    })

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
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'خطایی رخ داد' },
      { status: 500 }
    )
  }
}
