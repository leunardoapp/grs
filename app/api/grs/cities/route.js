// API route: /api/grs/cities
import { getCities } from '@/lib/grs-client'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const offset = searchParams.get('offset') || 0
    const count = searchParams.get('count') || 100

    const result = await getCities(offset, count)
    return Response.json(result)
  } catch (error) {
    console.error('[Cities API Error]', error)
    return Response.json(
      { code: 500, message: 'خطای سرور', error: [{ message: error.message }], value: null },
      { status: 500 }
    )
  }
}
