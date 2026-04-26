// API route: /api/grs/reserve-details
import { getReserveDetails } from '@/lib/grs-client'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const confirmationCode = searchParams.get('confirmation_code')

    if (!confirmationCode) {
      return Response.json(
        { code: 422, message: 'confirmation_code مورد نیاز است', error: [], value: null },
        { status: 422 }
      )
    }

    const result = await getReserveDetails(confirmationCode)
    return Response.json(result)
  } catch (error) {
    console.error('[Reserve Details API Error]', error)
    return Response.json(
      { code: 500, message: 'خطای سرور', error: [{ message: error.message }], value: null },
      { status: 500 }
    )
  }
}
