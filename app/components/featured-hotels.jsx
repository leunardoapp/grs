'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Star, MapPin } from 'lucide-react'
import { formatPrice } from '@/lib/persian-utils'

const featuredHotelsData = [
  {
    id: 1416,
    name: 'هتل آزمایشی مشهد',
    city: 'مشهد',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80',
    star: 5,
    price: 2500000,
    amenities: ['WiFi', 'استخر', 'فیتنس'],
  },
  {
    id: 2,
    name: 'هتل فایو تهران',
    city: 'تهران',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80',
    star: 4,
    price: 1800000,
    amenities: ['رستوران', 'پارکینگ', 'WiFi'],
  },
  {
    id: 3,
    name: 'ریزورت کیش',
    city: 'کیش',
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=500&q=80',
    star: 5,
    price: 3200000,
    amenities: ['ساحل خصوصی', 'اسپا', 'آب‌تنی'],
  },
  {
    id: 4,
    name: 'هتل شیراز',
    city: 'شیراز',
    image: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=500&q=80',
    star: 4,
    price: 1500000,
    amenities: ['رستوران', 'کافه', 'WiFi'],
  },
]

export default function FeaturedHotels() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2 text-foreground">اقامتگاه‌های برتر</h2>
        <p className="text-center text-foreground/60 mb-12">
          انتخاب‌شده‌ترین اقامتگاه‌های سال
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredHotelsData.map((hotel) => (
            <Link key={hotel.id} href={`/hotel/${hotel.id}`}>
              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-4 flex flex-col">
                  {/* Name */}
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 text-foreground">
                    {hotel.name}
                  </h3>

                  {/* City */}
                  <div className="flex items-center gap-1 text-foreground/60 text-sm mb-3">
                    <MapPin size={14} />
                    {hotel.city}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`${
                          i < hotel.star
                            ? 'fill-secondary text-secondary'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Amenities */}
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {hotel.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="mt-auto">
                    <p className="text-sm text-foreground/60">قیمت ابتدایی</p>
                    <p className="text-xl font-bold text-primary">
                      {formatPrice(hotel.price)} تومان
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
