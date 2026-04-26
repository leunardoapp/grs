'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader, AlertCircle, CheckCircle } from 'lucide-react'
import { translateReservationStatus } from '@/lib/translations'
import { toast } from 'sonner'

export default function PendingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const confirmationCode = params.code

  const [status, setStatus] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const checkIn = searchParams.get('check_in')
  const checkOut = searchParams.get('check_out')

  useEffect(() => {
    // Use Server-Sent Events for real-time updates
    const eventSource = new EventSource(`/api/events/${confirmationCode}`)

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === 'init') {
        setStatus(data.status)
        setLoading(false)
      } else if (data.type === 'update') {
        setStatus(data.status)

        if (data.status === 'CONFIRMED' || data.status === 'BOOKING') {
          toast.success('رزرو تأیید شد! منتقل به صفحه پرداخت...')
          setTimeout(() => {
            router.push(`/reserve/${confirmationCode}/payment?check_in=${checkIn}&check_out=${checkOut}`)
          }, 1500)
        } else if (data.status === 'CANCELLED') {
          setError('متأسفانه رزرو شما تأیید نشد')
        }
      }
    }

    eventSource.onerror = (err) => {
      console.error('SSE error:', err)
      eventSource.close()
      setLoading(false)
    }

    return () => {
      eventSource.close()
    }
  }, [confirmationCode, router, checkIn, checkOut])

  return (
    <div dir="rtl" className="bg-background min-h-screen flex items-center justify-center py-8">
      <Card className="w-full max-w-md p-8 text-center">
        {status === 'pending' ? (
          <>
            <div className="mb-6 flex justify-center">
              <div className="relative w-16 h-16">
                <Loader className="animate-spin text-primary" size={64} />
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-2 text-foreground">در حال بررسی رزرو</h1>
            <p className="text-foreground/60 mb-4">
              رزرو شما در حال بررسی است. لطفا صبر کنید...
            </p>

            <div className="bg-primary/10 rounded-lg p-4 mb-6">
              <p className="text-sm font-mono text-foreground/70">{confirmationCode}</p>
            </div>

            <p className="text-xs text-foreground/50">
              تلاش {pollCount} از 30
            </p>
          </>
        ) : status === 'booking' ? (
          <>
            <div className="mb-6 flex justify-center">
              <CheckCircle className="text-success" size={64} />
            </div>

            <h1 className="text-2xl font-bold mb-2 text-foreground">رزرو تأیید شد!</h1>
            <p className="text-foreground/60 mb-4">
              رزرو شما تأیید شد. منتقل به صفحه پرداخت...
            </p>

            <div className="bg-success/10 rounded-lg p-4 mb-6">
              <p className="text-sm font-mono text-foreground/70">{confirmationCode}</p>
            </div>

            <Loader className="animate-spin text-primary mx-auto" size={24} />
          </>
        ) : status === 'rejected' ? (
          <>
            <div className="mb-6 flex justify-center">
              <AlertCircle className="text-destructive" size={64} />
            </div>

            <h1 className="text-2xl font-bold mb-2 text-foreground">رزرو رد شد</h1>
            <p className="text-foreground/60 mb-6">
              متأسفانه رزرو شما توسط هتل تأیید نشد. لطفا دوباره تلاش کنید.
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => window.location.href = '/search'}
                className="w-full bg-primary hover:bg-primary/90"
              >
                جستجوی مجدد
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                صفحه اصلی
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 flex justify-center">
              <CheckCircle className="text-success" size={64} />
            </div>

            <h1 className="text-2xl font-bold mb-2 text-foreground">
              {translateReservationStatus(status)}
            </h1>
            <p className="text-foreground/60 mb-6">
              وضعیت رزرو: {translateReservationStatus(status)}
            </p>

            <div className="bg-success/10 rounded-lg p-4 mb-6">
              <p className="text-sm font-mono text-foreground/70">{confirmationCode}</p>
            </div>

            <Button
              onClick={() => router.push('/my-account/reservations')}
              className="w-full bg-primary hover:bg-primary/90"
            >
              مشاهده رزروهای من
            </Button>
          </>
        )}
      </Card>
    </div>
  )
}
