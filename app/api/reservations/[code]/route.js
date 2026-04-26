import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { grsClient } from '@/lib/grs-client'

export async function GET(req, { params }) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { code: params.code },
      include: {
        rooms: true,
        payment: true,
      },
    })

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(reservation)
  } catch (error) {
    console.error('Error fetching reservation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reservation' },
      { status: 500 }
    )
  }
}

export async function DELETE(req, { params }) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { code: params.code },
    })

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      )
    }

    // Call GRS to cancel reservation
    const result = await grsClient.cancelReserve(
      reservation.grsReserveCode,
      reservation.grsReserveId
    )

    if (!grsClient.isGrsSuccess(result)) {
      return NextResponse.json(
        { error: grsClient.getGrsErrorMessage(result) },
        { status: 400 }
      )
    }

    // Update local status
    await prisma.reservation.update({
      where: { code: params.code },
      data: { status: 'CANCELLED' },
    })

    return NextResponse.json({ success: true, status: 'CANCELLED' })
  } catch (error) {
    console.error('Error cancelling reservation:', error)
    return NextResponse.json(
      { error: 'Failed to cancel reservation' },
      { status: 500 }
    )
  }
}
