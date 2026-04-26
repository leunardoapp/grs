'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { formatCurrency } from '@/lib/persian-utils'
import { translateReservationStatus } from '@/lib/translations'
import { MoreVertical, Trash2, Eye } from 'lucide-react'

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const res = await fetch('/api/reservations/user?userId=current-user')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setReservations(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (code) => {
    if (!confirm('آیا مطمئن هستید؟')) return
    try {
      const res = await fetch(`/api/reservations/${code}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to cancel')
      setReservations(prev => prev.filter(r => r.code !== code))
    } catch (err) {
      alert('خطا در لغو رزرو')
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">رزروهای من</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {reservations.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">رزروی فعلی ندارید</p>
          <Link href="/search">
            <Button>جستجو هتل</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reservations.map((reservation) => (
            <Card key={reservation.id} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                <div>
                  <p className="text-sm text-muted-foreground">شماره رزرو</p>
                  <p className="font-mono text-lg">{reservation.code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">هتل</p>
                  <p className="font-medium">{reservation.hotelName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">وضعیت</p>
                  <Badge className={getStatusBadgeColor(reservation.status)}>
                    {translateReservationStatus(reservation.status)}
                  </Badge>
                </div>
                <div className="flex justify-end gap-2">
                  <Link href={`/my-account/reservations/${reservation.code}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancel(reservation.code)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
