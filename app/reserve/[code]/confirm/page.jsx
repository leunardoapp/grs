'use client'

import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle, Download, Share2 } from 'lucide-react'

export default function ConfirmationPage() {
  const params = useParams()
  const code = params.code

  const handleDownload = () => {
    const element = document.createElement('a')
    element.href = `/api/reservation-pdf/${code}`
    element.download = `booking-${code}.pdf`
    element.click()
  }

  const handleShare = () => {
    const bookingUrl = `${window.location.origin}/reserve/${code}/pending`
    navigator.share?.({
      title: 'بوکینگ هتل',
      text: `شماره رزرو من: ${code}`,
      url: bookingUrl,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-background p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        
        <h1 className="text-3xl font-bold mb-2">تایید شد!</h1>
        <p className="text-muted-foreground mb-6">رزرو شما با موفقیت ثبت شد</p>

        <div className="bg-muted p-4 rounded-lg mb-6">
          <p className="text-sm text-muted-foreground mb-1">شماره رزرو</p>
          <p className="font-mono text-2xl font-bold">{code}</p>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          لطفاً این شماره را برای مراجع آینده نگه دارید
        </p>

        <div className="space-y-3 mb-6">
          <Button className="w-full" onClick={handleDownload}>
            <Download className="w-4 h-4 ml-2" />
            دانلود رزرو
          </Button>
          <Button variant="outline" className="w-full" onClick={handleShare}>
            <Share2 className="w-4 h-4 ml-2" />
            اشتراک‌گذاری
          </Button>
        </div>

        <div className="space-y-2">
          <Link href={`/reserve/${code}/pending`} className="block">
            <Button variant="outline" className="w-full">
              مشاهده وضعیت
            </Button>
          </Link>
          <Link href="/" className="block">
            <Button className="w-full">
              بازگشت به خانه
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
