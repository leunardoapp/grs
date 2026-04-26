import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 10

    const where = status ? { status } : {}

    const [reservations, total] = await Promise.all([
      prisma.reservation.findMany({
        where,
        include: { payment: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.reservation.count({ where }),
    ])

    return NextResponse.json({
      reservations,
      pagination: {
        total,
        page,
        pageSize: limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    )
  }
}
