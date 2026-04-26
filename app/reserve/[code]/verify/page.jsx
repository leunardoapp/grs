'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function VerifyPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const confirmationCode = params.code

  const [status, setStatus] = useState('verifying')
  const [loading, setLoading] = useState(true)

  const paymentId = searchParams.get('payment_id')
  const paymentStatus = searchParams.get('status')

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        setLoading(true)

        const response = await fetch(
          `/api/payment/verify?confirmation_code=${confirmationCode}&payment_id=${paymentId}&status=${paymentStatus}`
        )
        const data = await response.json()

        setStatus(data.value?.status || 'failed')
      } catch (error) {
        console.error('Verify error:', error)
        setStatus('failed')
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [confirmationCode, paymentId, paymentStatus])

  return (
    <div dir="rtl" className="bg-background min-h-screen flex items-center justify-center py-8">
      <Card className="w-full max-w-md p-8 text-center">
        {loading ? (
          <>
            <div className="mb-6 flex justify-center">
              <Loader className="animate-spin text-primary" size={64} />
            </div>

            <h1 className="text-2xl font-bold mb-2 text-foreground">در حال تأیید پرداخت</h1>
            <p className="text-foreground/60">
              لطفا صبر کنید...
            </p>
          </>
        ) : status === 'verified' ? (
          <>
            <div className="mb-6 flex justify-center">
              <CheckCircle className="text-success" size={64} />
            </div>

            <h1 className="text-2xl font-bold mb-2 text-foreground">پرداخت موفق!</h1>
            <p className="text-foreground/60 mb-6">
              پرداخت شما با موفقیت تأیید شد و رزرو نهایی شده است.
            </p>

            <div className="bg-success/10 rounded-lg p-4 mb-6">
              <p className="text-sm font-mono text-foreground/70">{confirmationCode}</p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => router.push('/my-account/reservations')}
                className="w-full bg-primary hover:bg-primary/90"
              >
                مشاهده رزروهای من
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="w-full"
              >
                صفحه اصلی
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 flex justify-center">
              <AlertCircle className="text-destructive" size={64} />
            </div>

            <h1 className="text-2xl font-bold mb-2 text-foreground">پرداخت ناموفق</h1>
            <p className="text-foreground/60 mb-6">
              متأسفانه پرداخت شما ناموفق بود. رزرو منقضی خواهد شد.
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => router.push('/search')}
                className="w-full bg-primary hover:bg-primary/90"
              >
                جستجوی دوباره
              </Button>
              <Link href={`/reserve/${confirmationCode}/payment`}>
                <Button
                  variant="outline"
                  className="w-full"
                >
                  تلاش دوباره
                </Button>
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
