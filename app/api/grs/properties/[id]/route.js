// API route: /api/grs/properties/[id]
import { getPropertyDetails } from '@/lib/grs-client'

export async function GET(request, { params }) {
  try {
    const { id } = params
    const result = await getPropertyDetails(id)
    return Response.json(result)
  } catch (error) {
    console.error('[Property Details API Error]', error)
    return Response.json(
      { code: 500, message: 'خطای سرور', error: [{ message: error.message }], value: null },
      { status: 500 }
    )
  }
}
