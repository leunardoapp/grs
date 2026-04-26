import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const [
      totalReservations,
      totalRevenue,
      pendingReservations,
      confirmedReservations,
      totalUsers,
      recentReservations,
    ] = await Promise.all([
      prisma.reservation.count(),
      prisma.payment.aggregate({
        _sum: { amount: true },
      }),
      prisma.reservation.count({ where: { status: 'PENDING' } }),
      prisma.reservation.count({ where: { status: 'CONFIRMED' } }),
      prisma.user.count(),
      prisma.reservation.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { payment: true },
      }),
    ])

    const revenueByMonth = await prisma.payment.groupBy({
      by: ['createdAt'],
      _sum: { amount: true },
      orderBy: { createdAt: 'desc' },
      take: 12,
    })

    return NextResponse.json({
      totalReservations,
      totalRevenue: totalRevenue._sum.amount || 0,
      pendingReservations,
      confirmedReservations,
      totalUsers,
      recentReservations,
      revenueByMonth,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
