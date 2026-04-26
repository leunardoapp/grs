import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 10

    const [logs, total] = await Promise.all([
      prisma.webhookEvent.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.webhookEvent.count(),
    ])

    return NextResponse.json({
      logs,
      pagination: {
        total,
        page,
        pageSize: limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching webhook logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    )
  }
}
