// API route: /api/grs/reserve
import { createReserve, getReserveDetails } from '@/lib/grs-client'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const body = await request.json()

    // Call GRS API to create reserve
    const grsResponse = await createReserve(body.reserve)

    if (grsResponse.code !== 200 || !grsResponse.value?.reserve) {
      return Response.json(
        {
          code: grsResponse.code,
          message: grsResponse.message,
          error: grsResponse.error,
          value: null,
        },
        { status: grsResponse.code }
      )
    }

    const reserve = grsResponse.value.reserve

    // Save to local database
    try {
      const reservation = await prisma.reservation.create({
        data: {
          userId: body.userId,
          confirmationCode: reserve.confirmation_code,
          agencyConfirmationCode: body.agencyConfirmationCode || null,
          propertyId: reserve.property_id,
          propertyName: reserve.property_name || body.propertyName,
          checkIn: new Date(reserve.check_in),
          checkOut: new Date(reserve.check_out),
          status: reserve.status,
          state: reserve.state,
          totalPrice: reserve.total_price,
          totalSalesPrice: reserve.total_sales_price,
          expireAt: reserve.expire_at ? new Date(reserve.expire_at) : null,
          bookerFirstName: reserve.booker_first_name,
          bookerLastName: reserve.booker_last_name,
          bookerPhone: reserve.booker_phone,
          bookerEmail: reserve.booker_email,
          rooms: {
            create: (reserve.rooms || []).map((room) => ({
              roomTypeId: room.room_type_id,
              roomTypeName: room.room_type_name,
              ratePlanId: room.rate_plan_id,
              ratePlanName: room.rate_plan_name,
              adultCount: room.adult_count,
              children: room.children || [],
              guestFirstName: room.guest_first_name,
              guestLastName: room.guest_last_name,
              guestPhone: room.guest_phone,
              guestNationalCode: room.guest_national_code,
              totalPrice: room.total_price,
              totalSalesPrice: room.total_sales_price,
            })),
          },
        },
        include: { rooms: true },
      })

      return Response.json({
        code: 200,
        message: 'رزرو با موفقیت ایجاد شد',
        error: null,
        value: { reservation },
      })
    } catch (dbError) {
      console.error('Database error:', dbError)
      // Still return success to user since GRS accepted it
      return Response.json({
        code: 200,
        message: 'رزرو در GRS ایجاد شد',
        error: null,
        value: { reserve },
      })
    }
  } catch (error) {
    console.error('[Reserve API Error]', error)
    return Response.json(
      { code: 500, message: 'خطای سرور', error: [{ message: error.message }], value: null },
      { status: 500 }
    )
  }
}
