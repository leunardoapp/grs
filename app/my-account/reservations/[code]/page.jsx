'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { formatCurrency, formatPersianDate } from '@/lib/persian-utils'
import { translateReservationStatus } from '@/lib/translations'
import Link from 'next/link'

export default function ReservationDetailPage() {
  const params = useParams()
  const [reservation, setReservation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchReservation()
  }, [])

  const fetchReservation = async () => {
    try {
      const res = await fetch(`/api/reservations/${params.code}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setReservation(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleModify = () => {
    // Redirect to modification page
    window.location.href = `/reserve/${params.code}/modify`
  }

  const handleCancel = async () => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این رزرو را لغو کنید؟')) return
    try {
      const res = await fetch(`/api/reservations/${params.code}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to cancel')
      setReservation(prev => ({ ...prev, status: 'CANCELLED' }))
    } catch (err) {
      alert('خطا در لغو رزرو')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  if (error || !reservation) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error || 'رزروی یافت نشد'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link href="/my-account/reservations">
        <Button variant="outline" className="mb-6">
          ← بازگشت
        </Button>
      </Link>

      <div className="grid gap-6">
        {/* Header Card */}
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{reservation.hotelName}</h1>
              <p className="text-muted-foreground">رزرو: {reservation.code}</p>
            </div>
            <Badge className="text-lg px-4 py-2">
              {translateReservationStatus(reservation.status)}
            </Badge>
          </div>
        </Card>

        {/* Reservation Details */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">جزئیات رزرو</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">تاریخ ورود</p>
              <p className="font-medium">{formatPersianDate(reservation.checkInDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">تاریخ خروج</p>
              <p className="font-medium">{formatPersianDate(reservation.checkOutDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">تعداد شب</p>
              <p className="font-medium">{reservation.nights} شب</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">تعداد اتاق</p>
              <p className="font-medium">{reservation.rooms?.length || 0} اتاق</p>
            </div>
          </div>
        </Card>

        {/* Guest Information */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">اطلاعات مهمان</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">نام</p>
              <p className="font-medium">{reservation.guestFirstName} {reservation.guestLastName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">شماره تماس</p>
              <p className="font-medium">{reservation.guestPhone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ایمیل</p>
              <p className="font-medium">{reservation.guestEmail}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ملیت</p>
              <p className="font-medium">{reservation.guestNationality}</p>
            </div>
          </div>
        </Card>

        {/* Pricing */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">خلاصه هزینه</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>قیمت کل</span>
              <span className="font-medium">{formatCurrency(reservation.totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>مالیات و عوارض</span>
              <span className="font-medium">{formatCurrency(reservation.taxPrice || 0)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg font-bold">
              <span>مبلغ نهایی</span>
              <span>{formatCurrency(reservation.totalPrice + (reservation.taxPrice || 0))}</span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          {reservation.status === 'PENDING' && (
            <>
              <Button onClick={handleModify} variant="outline">
                ویرایش رزرو
              </Button>
              <Button onClick={handleCancel} variant="destructive">
                لغو رزرو
              </Button>
            </>
          )}
          {reservation.status === 'CONFIRMED' && (
            <Button onClick={handleCancel} variant="destructive">
              لغو رزرو
            </Button>
          )}
        </div>

        {/* Activity Log */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">سابقه فعالیت</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium">رزرو ایجاد شد</p>
                <p className="text-sm text-muted-foreground">{formatPersianDate(reservation.createdAt)}</p>
              </div>
            </div>
            {reservation.payment && (
              <div className="flex gap-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">پرداخت انجام شد</p>
                  <p className="text-sm text-muted-foreground">{formatPersianDate(reservation.payment.createdAt)}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
