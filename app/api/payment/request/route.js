// API route: /api/payment/request
export async function POST(request) {
  try {
    const body = await request.json()
    const { confirmationCode, amount, redirectUrl } = body

    // TODO: Integrate with actual payment gateway (ZarinPal, etc.)
    // For now, return a mock payment URL

    // Example for ZarinPal:
    // const response = await fetch('https://api.zarinpal.com/rest/web/pay/request.json', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     merchant_id: process.env.ZARINPAL_MERCHANT_ID,
    //     amount,
    //     currency: 'IRR',
    //     description: `رزرو هتل - ${confirmationCode}`,
    //     callback_url: redirectUrl,
    //   }),
    // })

    // Mock response - Remove this and replace with actual payment gateway
    const mockPaymentId = `MOCK_${Date.now()}`
    const mockPaymentUrl = `${redirectUrl}?payment_id=${mockPaymentId}&status=success`

    return Response.json({
      code: 200,
      message: 'درخواست پرداخت ایجاد شد',
      error: null,
      value: {
        paymentUrl: mockPaymentUrl,
        paymentId: mockPaymentId,
      },
    })
  } catch (error) {
    console.error('[Payment Request API Error]', error)
    return Response.json(
      { code: 500, message: 'خطای سرور', error: [{ message: error.message }], value: null },
      { status: 500 }
    )
  }
}
