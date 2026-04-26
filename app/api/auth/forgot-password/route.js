import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { randomBytes } from 'crypto'

export async function POST(req) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'ایمیل الزامی است' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      // Don't reveal if email exists
      return NextResponse.json({
        message: 'اگر این ایمیل ثبت شده باشد، لینک بازیابی رمز فرستاده خواهد شد',
      })
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // In a real app, send email with reset link
    console.log(
      `Reset link: ${process.env.NEXT_PUBLIC_URL}/auth/reset-password?token=${resetToken}`
    )

    return NextResponse.json({
      message: 'اگر این ایمیل ثبت شده باشد، لینک بازیابی رمز فرستاده خواهد شد',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'خطایی رخ داد' },
      { status: 500 }
    )
  }
}
