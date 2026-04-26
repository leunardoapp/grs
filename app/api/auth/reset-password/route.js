import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req) {
  try {
    const body = await req.json()
    const { token, password, confirmPassword } = body

    if (!token || !password || !confirmPassword) {
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

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'لینک منقضی است' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    return NextResponse.json({
      message: 'رمز عبور تغییر یافت',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'خطایی رخ داد' },
      { status: 500 }
    )
  }
}
