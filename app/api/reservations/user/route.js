import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    const reservations = await prisma.reservation.findMany({
      where: { userId },
      include: {
        rooms: true,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(reservations)
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    )
  }
}
