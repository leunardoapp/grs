'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Loader, Clock } from 'lucide-react'
import { formatPrice, formatTimeRemaining, getTimeUntil, toPersianDigits } from '@/lib/persian-utils'
import { toast } from 'sonner'

export default function PaymentPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const confirmationCode = params.code

  const [reservation, setReservation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [error, setError] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState(null)

  const checkIn = searchParams.get('check_in')
  const checkOut = searchParams.get('check_out')

  useEffect(() => {
    fetchReservation()
  }, [confirmationCode])

  useEffect(() => {
    if (!reservation?.expireAt) return

    const updateTimer = () => {
      const time = getTimeUntil(reservation.expireAt)
      setTimeRemaining(time)

      if (!time) {
        setError('مهلت زمانی رزرو منقضی شده است')
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [reservation?.expireAt])

  const fetchReservation = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/grs/reserve-details?confirmation_code=${confirmationCode}`
      )
      const data = await response.json()

      if (data.code === 200 && data.value?.reserve) {
        setReservation(data.value.reserve)

        // Check if status is not booking
        if (data.value.reserve.status !== 'booking') {
          setError('وضعیت رزرو برای پرداخت مناسب نیست')
        }
      } else {
        setError('رزرو یافت نشد')
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setError('خطا در دریافت اطلاعات')
    } finally {
      setLoading(false)
    }
  }

  const handleExtendTime = async () => {
    try {
      setPaymentLoading(true)
      const response = await fetch(`/api/grs/extended-expired-time/${confirmationCode}`, {
        method: 'POST',
      })
      const data = await response.json()

      if (data.code === 200) {
        toast.success('مهلت زمانی تمدید شد')
        fetchReservation()
      } else {
        toast.error('خطا در تمدید مهلت')
      }
    } catch (err) {
      console.error('Extend error:', err)
      toast.error('خطا در ارتباط')
    } finally {
      setPaymentLoading(false)
    }
  }

  const handlePayment = async () => {
    try {
      setPaymentLoading(true)

      // Step 1: Request payment from payment gateway
      const paymentResponse = await fetch('/api/payment/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmationCode,
          amount: reservation.total_sales_price,
          redirectUrl: `${window.location.origin}/reserve/${confirmationCode}/verify`,
        }),
      })

      const paymentData = await paymentResponse.json()

      if (paymentData.code === 200 && paymentData.value?.paymentUrl) {
        // Redirect to payment gateway
        window.location.href = paymentData.value.paymentUrl
      } else {
        toast.error(paymentData.message || 'خطا در درخواست پرداخت')
      }
    } catch (err) {
      console.error('Payment error:', err)
      toast.error('خطا در ارتباط با درگاه پرداخت')
    } finally {
      setPaymentLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader className="animate-spin text-primary" size={40} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background py-8">
        <Card className="w-full max-w-md p-8">
          <div className="flex justify-center mb-4">
            <AlertCircle size={48} className="text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2 text-foreground">{error}</h1>
          <p className="text-center text-foreground/60 mb-6">
            {error === 'مهلت زمانی رزرو منقضی شده است'
              ? 'لطفا رزرو جدید ایجاد کنید'
              : 'لطفا بعدا دوباره تلاش کنید'}
          </p>
          <Button
            onClick={() => router.push('/search')}
            className="w-full bg-primary hover:bg-primary/90"
          >
            بازگشت
          </Button>
        </Card>
      </div>
    )
  }

  if (!reservation) {
    return null
  }

  const isUrgent = timeRemaining && timeRemaining.hours < 1

  return (
    <div dir="rtl" className="bg-background min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-foreground">پرداخت</h1>

        {isUrgent && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-4 mb-6 flex gap-3">
            <AlertCircle size={20} className="text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-destructive font-semibold">مهلت زمانی کم!</p>
              <p className="text-destructive/80 text-sm">
                لطفا در کمترین زمان ممکن پرداخت را انجام دهید
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Reservation Summary */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 text-foreground">خلاصه رزرو</h2>

              <div className="space-y-3 pb-4 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-foreground/60">هتل:</span>
                  <span className="font-semibold text-foreground">{reservation.property_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">ورود:</span>
                  <span className="font-semibold text-foreground">{checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">خروج:</span>
                  <span className="font-semibold text-foreground">{checkOut}</span>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex justify-between">
                  <span className="text-foreground/60">مهمان:</span>
                  <span className="font-semibold text-foreground">
                    {reservation.booker_first_name} {reservation.booker_last_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">کد رزرو:</span>
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {reservation.confirmation_code}
                  </span>
                </div>
              </div>
            </Card>

            {/* Price Breakdown */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 text-foreground">محاسبه هزینه</h2>

              <div className="space-y-2">
                <div className="flex justify-between text-foreground/60">
                  <span>قیمت کل:</span>
                  <span>{formatPrice(reservation.total_price)} تومان</span>
                </div>
                <div className="flex justify-between text-foreground/60">
                  <span>تخفیف و کمیسیون:</span>
                  <span>
                    {formatPrice(
                      Math.max(0, reservation.total_price - reservation.total_sales_price)
                    )}{' '}
                    تومان
                  </span>
                </div>

                <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                  <span>مبلغ نهایی:</span>
                  <span className="text-primary">
                    {formatPrice(reservation.total_sales_price)} تومان
                  </span>
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 text-foreground">درگاه پرداخت</h2>
              <p className="text-foreground/60 mb-4">
                پرداخت از طریق درگاه ZarinPal
              </p>

              <Button
                onClick={handlePayment}
                disabled={paymentLoading || error !== null}
                className="w-full bg-primary hover:bg-primary/90 py-3 font-bold text-lg"
              >
                {paymentLoading ? (
                  <>
                    <Loader size={18} className="animate-spin ml-2" />
                    درحال تغییر مسیر...
                  </>
                ) : (
                  'پرداخت و تأیید رزرو'
                )}
              </Button>
            </Card>
          </div>

          {/* Sidebar - Timer */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20 border-2 border-destructive">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={20} className="text-destructive" />
                <h3 className="text-lg font-bold text-foreground">مهلت باقی‌مانده</h3>
              </div>

              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-destructive mb-2">
                  {timeRemaining
                    ? `${toPersianDigits(
                        String(timeRemaining.hours).padStart(2, '0')
                      )}:${toPersianDigits(
                        String(timeRemaining.minutes).padStart(2, '0')
                      )}:${toPersianDigits(
                        String(timeRemaining.seconds).padStart(2, '0')
                      )}`
                    : 'منقضی'}
                </div>
                <p className="text-sm text-foreground/60">ساعت : دقیقه : ثانیه</p>
              </div>

              {isUrgent && (
                <Button
                  onClick={handleExtendTime}
                  disabled={paymentLoading}
                  variant="outline"
                  className="w-full mb-4"
                >
                  {paymentLoading ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    'تمدید زمان'
                  )}
                </Button>
              )}

              <p className="text-xs text-foreground/60 text-center">
                پس از اتمام مهلت، رزرو لغو خواهد شد
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
