import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req, { params }) {
  const code = params.code

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      
      // Send initial data
      const reservation = await prisma.reservation.findUnique({
        where: { code },
        include: { payment: true },
      })

      if (!reservation) {
        controller.enqueue(encoder.encode('data: {"error":"Reservation not found"}\n\n'))
        controller.close()
        return
      }

      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({
            type: 'init',
            status: reservation.status,
            reservation,
          })}\n\n`
        )
      )

      // Poll for updates every 5 seconds
      const interval = setInterval(async () => {
        try {
          const updated = await prisma.reservation.findUnique({
            where: { code },
            include: { payment: true },
          })

          if (updated && updated.status !== reservation.status) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'update',
                  status: updated.status,
                  reservation: updated,
                })}\n\n`
              )
            )
          }
        } catch (err) {
          console.error('SSE error:', err)
          clearInterval(interval)
          controller.close()
        }
      }, 5000)

      // Clean up on client disconnect
      req.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
