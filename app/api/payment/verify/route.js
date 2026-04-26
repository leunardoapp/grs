// API route: /api/payment/verify
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const confirmationCode = searchParams.get('confirmation_code')
    const paymentId = searchParams.get('payment_id')
    const status = searchParams.get('status')

    // TODO: Verify payment with actual payment gateway
    // For now, we'll just update the database based on status

    let verificationStatus = 'failed'

    if (status === 'success' || status === '0') {
      verificationStatus = 'verified'

      // Update reservation in database
      try {
        await prisma.reservation.update({
          where: { confirmationCode },
          data: {
            status: 'confirmed',
            state: 'paid',
          },
        })
      } catch (dbError) {
        console.error('DB update error:', dbError)
        // Continue even if DB update fails
      }
    }

    return Response.json({
      code: 200,
      message: verificationStatus === 'verified' ? 'پرداخت تأیید شد' : 'پرداخت ناموفق بود',
      error: null,
      value: {
        status: verificationStatus,
        confirmationCode,
        paymentId,
      },
    })
  } catch (error) {
    console.error('[Payment Verify API Error]', error)
    return Response.json(
      { code: 500, message: 'خطای سرور', error: [{ message: error.message }], value: null },
      { status: 500 }
    )
  }
}
