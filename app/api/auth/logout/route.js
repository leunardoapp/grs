import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const response = NextResponse.json({ success: true })
    response.cookies.delete('auth_token')
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'خطایی رخ داد' },
      { status: 500 }
    )
  }
}
