// API route: /api/grs/extended-expired-time/[code]
import { extendExpiredTime } from '@/lib/grs-client'

export async function POST(request, { params }) {
  try {
    const { code } = params

    if (!code) {
      return Response.json(
        { code: 422, message: 'confirmation_code مورد نیاز است', error: [], value: null },
        { status: 422 }
      )
    }

    const result = await extendExpiredTime(code)
    return Response.json(result)
  } catch (error) {
    console.error('[Extend Expired Time API Error]', error)
    return Response.json(
      { code: 500, message: 'خطای سرور', error: [{ message: error.message }], value: null },
      { status: 500 }
    )
  }
}
