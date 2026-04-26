'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader, AlertCircle } from 'lucide-react'
import { formatPrice, toPersianDigits } from '@/lib/persian-utils'
import { toast } from 'sonner'

export default function ReservePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    // Booker
    bookerFirstName: '',
    bookerLastName: '',
    bookerPhone: '',
    bookerEmail: '',

    // Guest
    guestFirstName: '',
    guestLastName: '',
    guestPhone: '',
    guestEmail: '',
    guestNationalCode: '',

    // Additional
    vehicle: '',
    vehicleNumber: '',
    specialRequests: '',
  })

  // Get params from URL
  const propertyId = searchParams.get('property_id')
  const roomTypeId = searchParams.get('room_type_id')
  const ratePlanId = searchParams.get('rate_plan_id')
  const checkIn = searchParams.get('check_in')
  const checkOut = searchParams.get('check_out')

  if (!propertyId || !roomTypeId || !ratePlanId || !checkIn || !checkOut) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle size={40} className="mx-auto text-destructive mb-4" />
          <p className="text-foreground mb-4">اطلاعات رزرو کافی نیست</p>
          <Link href="/search">
            <Button className="w-full">بازگشت به جستجو</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setError('')
  }

  const validateForm = () => {
    if (
      !formData.bookerFirstName ||
      !formData.bookerLastName ||
      !formData.bookerPhone ||
      !formData.guestFirstName ||
      !formData.guestLastName ||
      !formData.guestPhone
    ) {
      setError('لطفا تمام فیلدهای ضروری را پر کنید')
      return false
    }

    // Simple phone validation
    if (!/^09\d{9}$/.test(formData.bookerPhone)) {
      setError('شماره موبایل نامعتبر است')
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)

    try {
      const reserveData = {
        property_id: parseInt(propertyId),
        check_in: checkIn,
        check_out: checkOut,
        booker_first_name: formData.bookerFirstName,
        booker_last_name: formData.bookerLastName,
        booker_phone: formData.bookerPhone,
        booker_email: formData.bookerEmail || null,
        vehicle: formData.vehicle || null,
        vehicle_number: formData.vehicleNumber || null,
        description: formData.specialRequests || null,
        rooms: [
          {
            room_type_id: parseInt(roomTypeId),
            rate_plan_id: parseInt(ratePlanId),
            count: 1,
            adult_count: 1,
            children: [],
            guest_first_name: formData.guestFirstName,
            guest_last_name: formData.guestLastName,
            guest_phone: formData.guestPhone,
            guest_email: formData.guestEmail || null,
            guest_national_code: formData.guestNationalCode || null,
          },
        ],
      }

      const response = await fetch('/api/grs/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reserve: reserveData,
          userId: 'temp-user', // TODO: Get from session
          agencyConfirmationCode: Date.now().toString(),
          propertyName: 'Hotel', // TODO: Get from hotel data
        }),
      })

      const data = await response.json()

      if (data.code === 200 && data.value?.reservation?.confirmationCode) {
        toast.success('رزرو ثبت شد!')
        router.push(
          `/reserve/${data.value.reservation.confirmationCode}/pending?check_in=${checkIn}&check_out=${checkOut}`
        )
      } else if (data.value?.reserve?.confirmation_code) {
        toast.success('رزرو ثبت شد!')
        router.push(
          `/reserve/${data.value.reserve.confirmation_code}/pending?check_in=${checkIn}&check_out=${checkOut}`
        )
      } else {
        setError(data.message || 'خطای نامشخصی رخ داد')
      }
    } catch (err) {
      console.error('Reserve error:', err)
      setError('خطای ارتباط با سرور')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div dir="rtl" className="bg-background min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-foreground">اطلاعات رزرو</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive rounded-lg p-4 flex gap-3">
                <AlertCircle size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-destructive">{error}</p>
              </div>
            )}

            {/* Booker Information */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 text-foreground">اطلاعات رزرو‌کننده</h2>

              <FieldGroup className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>نام</FieldLabel>
                    <Input
                      value={formData.bookerFirstName}
                      onChange={(e) => handleInputChange('bookerFirstName', e.target.value)}
                      placeholder="نام رزرو‌کننده"
                      dir="rtl"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>نام خانوادگی</FieldLabel>
                    <Input
                      value={formData.bookerLastName}
                      onChange={(e) => handleInputChange('bookerLastName', e.target.value)}
                      placeholder="نام خانوادگی"
                      dir="rtl"
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel>موبایل</FieldLabel>
                  <Input
                    value={formData.bookerPhone}
                    onChange={(e) => handleInputChange('bookerPhone', e.target.value)}
                    placeholder="09xxxxxxxxx"
                    dir="ltr"
                  />
                </Field>

                <Field>
                  <FieldLabel>ایمیل (اختیاری)</FieldLabel>
                  <Input
                    type="email"
                    value={formData.bookerEmail}
                    onChange={(e) => handleInputChange('bookerEmail', e.target.value)}
                    placeholder="your@email.com"
                    dir="ltr"
                  />
                </Field>
              </FieldGroup>
            </Card>

            {/* Guest Information */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 text-foreground">اطلاعات مهمان</h2>

              <FieldGroup className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>نام</FieldLabel>
                    <Input
                      value={formData.guestFirstName}
                      onChange={(e) => handleInputChange('guestFirstName', e.target.value)}
                      placeholder="نام مهمان"
                      dir="rtl"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>نام خانوادگی</FieldLabel>
                    <Input
                      value={formData.guestLastName}
                      onChange={(e) => handleInputChange('guestLastName', e.target.value)}
                      placeholder="نام خانوادگی"
                      dir="rtl"
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel>موبایل</FieldLabel>
                  <Input
                    value={formData.guestPhone}
                    onChange={(e) => handleInputChange('guestPhone', e.target.value)}
                    placeholder="09xxxxxxxxx"
                    dir="ltr"
                  />
                </Field>

                <Field>
                  <FieldLabel>ایمیل (اختیاری)</FieldLabel>
                  <Input
                    type="email"
                    value={formData.guestEmail}
                    onChange={(e) => handleInputChange('guestEmail', e.target.value)}
                    placeholder="your@email.com"
                    dir="ltr"
                  />
                </Field>

                <Field>
                  <FieldLabel>کد ملی (اختیاری)</FieldLabel>
                  <Input
                    value={formData.guestNationalCode}
                    onChange={(e) => handleInputChange('guestNationalCode', e.target.value)}
                    placeholder="کد ملی"
                    dir="ltr"
                  />
                </Field>
              </FieldGroup>
            </Card>

            {/* Additional Information */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 text-foreground">اطلاعات اضافی</h2>

              <FieldGroup className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>نوع وسیله (اختیاری)</FieldLabel>
                    <Input
                      value={formData.vehicle}
                      onChange={(e) => handleInputChange('vehicle', e.target.value)}
                      placeholder="مثال: خودرو، موتورسیکلت"
                      dir="rtl"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>شماره وسیله (اختیاری)</FieldLabel>
                    <Input
                      value={formData.vehicleNumber}
                      onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                      placeholder="شماره پلاک"
                      dir="ltr"
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel>درخواست های خاص (اختیاری)</FieldLabel>
                  <Textarea
                    value={formData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    placeholder="درخواست‌های خاصی دارید؟"
                    dir="rtl"
                    className="min-h-24"
                  />
                </Field>
              </FieldGroup>
            </Card>
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20">
              <h3 className="text-lg font-bold mb-6 text-foreground">خلاصه رزرو</h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60">تاریخ ورود:</span>
                  <span className="font-semibold text-foreground">{checkIn}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60">تاریخ خروج:</span>
                  <span className="font-semibold text-foreground">{checkOut}</span>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 py-3 text-white font-bold rounded-lg"
              >
                {loading ? (
                  <>
                    <Loader size={16} className="animate-spin ml-2" />
                    درحال پردازش...
                  </>
                ) : (
                  'ادامه برای پرداخت'
                )}
              </Button>

              <p className="text-xs text-foreground/60 text-center mt-4">
                با ادامه، شما شرایط و ضوابط ما را می‌پذیرید
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
