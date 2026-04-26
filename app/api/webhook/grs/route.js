// API route: /api/webhook/grs
// Webhook receiver for GRS events

import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const payload = await request.json()

    console.log('[GRS Webhook]', payload.method, payload.value?.confirmation_code)

    // Validate webhook
    // In production: verify IP whitelist or signature
    // For now: basic validation

    // Save webhook event to database
    const webhookEvent = await prisma.webhookEvent.create({
      data: {
        method: payload.method,
        payload: payload,
        reservationId: payload.value?.confirmation_code ? undefined : null,
        processed: false,
      },
    })

    // Handle different webhook types
    if (payload.method === 'reserve_changed' && payload.value?.confirmation_code) {
      // Find reservation and update status
      const reservation = await prisma.reservation.findUnique({
        where: { confirmationCode: payload.value.confirmation_code },
      })

      if (reservation) {
        // Update reservation with new status
        await prisma.reservation.update({
          where: { id: reservation.id },
          data: {
            status: payload.value.status,
            state: payload.value.state,
            expireAt: payload.value.expire_at ? new Date(payload.value.expire_at) : null,
            totalPrice: payload.value.total_price,
            totalSalesPrice: payload.value.total_sales_price,
          },
        })

        // Update webhook event as processed
        await prisma.webhookEvent.update({
          where: { id: webhookEvent.id },
          data: { processed: true, reservationId: reservation.id },
        })

        // TODO: Send SMS/Email notification
        // TODO: Broadcast via SSE to connected clients
      }
    } else if (payload.method === 'available_changed') {
      // Available rooms changed
      // Update cache if using Redis
      console.log('[Webhook] Available rooms changed')
    } else if (payload.method === 'property_changed') {
      // Property info changed
      console.log('[Webhook] Property changed')
    }

    // Always return 200 to acknowledge receipt
    // GRS retries 3 times if not 200
    return Response.json({ success: true, code: 200 }, { status: 200 })
  } catch (error) {
    console.error('[Webhook Error]', error)
    // Still return 200 so GRS doesn't retry
    return Response.json({ success: false, error: error.message, code: 500 }, { status: 200 })
  }
}
