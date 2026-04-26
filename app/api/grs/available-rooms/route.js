// API route: /api/grs/available-rooms
import { getAvailableRooms } from '@/lib/grs-client'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('property_id')
    const checkIn = searchParams.get('check_in')
    const checkOut = searchParams.get('check_out')

    if (!propertyId || !checkIn || !checkOut) {
      return Response.json(
        {
          code: 422,
          message: 'property_id, check_in, check_out مورد نیاز است',
          error: [],
          value: null,
        },
        { status: 422 }
      )
    }

    const result = await getAvailableRooms(propertyId, checkIn, checkOut)
    return Response.json(result)
  } catch (error) {
    console.error('[Available Rooms API Error]', error)
    return Response.json(
      { code: 500, message: 'خطای سرور', error: [{ message: error.message }], value: null },
      { status: 500 }
    )
  }
}
