'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, MapPin, Phone, MapPinCheckInside, Wifi, TrendingUp, Users, Calendar, Loader } from 'lucide-react'
import { formatPrice, getNights, toPersianDigits } from '@/lib/persian-utils'
import { getMealPlanPersian } from '@/lib/translations'

export default function HotelDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const hotelId = params.id

  const [hotel, setHotel] = useState(null)
  const [roomTypes, setRoomTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedImages, setSelectedImages] = useState(0)

  const checkIn = searchParams.get('check_in')
  const checkOut = searchParams.get('check_out')
  const nights = checkIn && checkOut ? getNights(checkIn, checkOut) : 0

  useEffect(() => {
    fetchHotelDetails()
    fetchRoomTypes()
  }, [hotelId])

  const fetchHotelDetails = async () => {
    try {
      const response = await fetch(`/api/grs/properties/${hotelId}`)
      const data = await response.json()
      if (data.code === 200 && data.value?.properties?.length > 0) {
        setHotel(data.value.properties[0])
      }
    } catch (error) {
      console.error('Error fetching hotel:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRoomTypes = async () => {
    try {
      const response = await fetch(`/api/grs/room-types?property_id=${hotelId}`)
      const data = await response.json()
      if (data.code === 200 && data.value?.room_types) {
        setRoomTypes(data.value.room_types)
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader className="animate-spin text-primary" size={40} />
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Card className="p-8 text-center">
          <p className="text-foreground/60 text-lg mb-4">هتل یافت نشد</p>
          <Link href="/search">
            <Button>بازگشت به جستجو</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const images = hotel.images || []
  const currentImage = images[selectedImages] || { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80' }

  return (
    <div dir="rtl" className="bg-background min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Image Gallery */}
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Image */}
          <div className="lg:col-span-2 relative h-96 overflow-hidden rounded-lg">
            <Image
              src={currentImage.url || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80'}
              alt={hotel.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 lg:col-span-1">
            {images.slice(0, 6).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImages(idx)}
                className={`relative h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition ${
                  selectedImages === idx ? 'border-primary' : 'border-border'
                }`}
              >
                <Image
                  src={img.url}
                  alt={`Gallery ${idx}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hotel Info */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">{hotel.name}</h1>

              {/* Rating and Location */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={`${
                        i < (hotel.star || 0) ? 'fill-secondary text-secondary' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-foreground/60">({hotel.grade})</span>
                </div>

                <div className="flex items-center gap-2 text-foreground/60">
                  <MapPin size={18} />
                  <span>{hotel.address}</span>
                </div>
              </div>

              {/* Contact */}
              <div className="flex gap-6 text-sm text-foreground/60 mb-6">
                {hotel.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} />
                    <span dir="ltr">{hotel.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {hotel.description && (
              <Card className="p-6 mb-8">
                <h2 className="text-xl font-bold mb-4 text-foreground">درباره این اقامتگاه</h2>
                <p className="text-foreground/70 leading-relaxed">{hotel.description}</p>
              </Card>
            )}

            {/* Facilities */}
            {hotel.facilities && hotel.facilities.length > 0 && (
              <Card className="p-6 mb-8">
                <h2 className="text-xl font-bold mb-4 text-foreground">امکانات</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {hotel.facilities.map((facility, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Wifi size={16} className="text-primary flex-shrink-0" />
                      <span className="text-foreground/70 text-sm">{facility.name}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Rules */}
            {hotel.rules && hotel.rules.length > 0 && (
              <Card className="p-6 mb-8">
                <h2 className="text-xl font-bold mb-4 text-foreground">قوانین هتل</h2>
                <div className="space-y-3">
                  {hotel.rules.map((rule, idx) => (
                    <div key={idx} className="flex gap-3">
                      <span className="text-primary flex-shrink-0">•</span>
                      <div>
                        <p className="font-semibold text-foreground">{rule.title}</p>
                        <p className="text-sm text-foreground/60">{rule.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Room Types */}
            <h2 className="text-2xl font-bold mb-6 text-foreground">انواع اتاق</h2>
            <div className="space-y-6">
              {roomTypes.map((room) => (
                <Card key={room.id} className="p-6 hover:shadow-lg transition">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Room Info */}
                    <div className="sm:col-span-2">
                      <h3 className="text-xl font-bold text-foreground mb-2">{room.name}</h3>

                      {/* Capacity */}
                      <div className="flex gap-4 text-sm text-foreground/60 mb-4">
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>ظرفیت: {room.capacity} نفر</span>
                        </div>
                        {room.extra_capacity && (
                          <div className="flex items-center gap-1">
                            <TrendingUp size={14} />
                            <span>نفر اضافه: {room.extra_capacity}</span>
                          </div>
                        )}
                      </div>

                      {/* Rate Plans */}
                      <div className="space-y-3">
                        {room.rate_plans?.map((plan, idx) => (
                          <div
                            key={idx}
                            className="border border-border rounded-lg p-4 hover:bg-primary/5 transition"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-semibold text-foreground">{plan.name}</p>
                                <p className="text-xs text-foreground/60">
                                  {getMealPlanPersian(plan.meal_type)}
                                </p>
                              </div>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  plan.cancelable
                                    ? 'bg-success/10 text-success'
                                    : 'bg-destructive/10 text-destructive'
                                }`}
                              >
                                {plan.cancelable ? 'قابل کنسلی' : 'غیرقابل کنسلی'}
                              </span>
                            </div>

                            <div className="flex items-end justify-between">
                              <div>
                                <p className="text-xs text-foreground/60 mb-1">قیمت شب</p>
                                <p className="text-lg font-bold text-primary">
                                  {formatPrice(plan.price)} تومان
                                </p>
                                {nights > 0 && (
                                  <p className="text-xs text-foreground/60">
                                    کل: {formatPrice(plan.price * nights)} تومان
                                  </p>
                                )}
                              </div>
                              <Button
                                onClick={() => setSelectedRoom({ room, plan, roomIdx: idx })}
                                className="bg-primary hover:bg-primary/90"
                              >
                                انتخاب
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Room Image */}
                    <div className="relative h-48 rounded-lg overflow-hidden bg-gray-200">
                      <Image
                        src={
                          room.images?.[0]?.url ||
                          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80'
                        }
                        alt={room.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar - Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20">
              <h3 className="text-lg font-bold mb-6 text-foreground">خلاصه رزرو</h3>

              {/* Dates */}
              <div className="mb-6 pb-6 border-b border-border">
                <div className="space-y-3">
                  {checkIn && (
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/60">ورود:</span>
                      <span className="font-semibold text-foreground">{checkIn}</span>
                    </div>
                  )}
                  {checkOut && (
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/60">خروج:</span>
                      <span className="font-semibold text-foreground">{checkOut}</span>
                    </div>
                  )}
                  {nights > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/60">شب:</span>
                      <span className="font-semibold text-foreground">{toPersianDigits(nights.toString())}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Hotel Info */}
              <div className="mb-6 pb-6 border-b border-border">
                <p className="font-semibold text-foreground mb-1">{hotel.name}</p>
                <p className="text-xs text-foreground/60">{hotel.address}</p>
              </div>

              {selectedRoom && (
                <>
                  {/* Selected Room */}
                  <div className="mb-6 pb-6 border-b border-border">
                    <p className="text-xs text-foreground/60 mb-1">اتاق انتخاب شده</p>
                    <p className="font-semibold text-foreground mb-2">{selectedRoom.room.name}</p>
                    <p className="text-sm text-foreground/60">{selectedRoom.plan.name}</p>
                  </div>

                  {/* Price Calculation */}
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/60">قیمت شب:</span>
                      <span className="text-foreground">{formatPrice(selectedRoom.plan.price)} تومان</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/60">تعداد شب:</span>
                      <span className="text-foreground">{toPersianDigits(nights.toString())}</span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between font-bold">
                      <span className="text-foreground">مجموع:</span>
                      <span className="text-primary text-lg">
                        {formatPrice(selectedRoom.plan.price * nights)} تومان
                      </span>
                    </div>
                  </div>

                  {/* Reserve Button */}
                  <Button
                    onClick={() => {
                      // Store selected room in URL or state management
                      const params = new URLSearchParams({
                        property_id: hotelId,
                        room_type_id: selectedRoom.room.id,
                        rate_plan_id: selectedRoom.plan.id,
                        check_in: checkIn,
                        check_out: checkOut,
                      })
                      router.push(`/reserve?${params.toString()}`)
                    }}
                    className="w-full bg-primary hover:bg-primary/90 py-3 text-white font-bold rounded-lg"
                  >
                    ادامه رزرو
                  </Button>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
