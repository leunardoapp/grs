// API route: /api/grs/room-types
import { getRoomTypes } from '@/lib/grs-client'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('property_id')

    if (!propertyId) {
      return Response.json(
        { code: 422, message: 'property_id مورد نیاز است', error: [], value: null },
        { status: 422 }
      )
    }

    const result = await getRoomTypes(propertyId)
    return Response.json(result)
  } catch (error) {
    console.error('[Room Types API Error]', error)
    return Response.json(
      { code: 500, message: 'خطای سرور', error: [{ message: error.message }], value: null },
      { status: 500 }
    )
  }
}
