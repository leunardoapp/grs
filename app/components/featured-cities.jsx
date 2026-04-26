'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'

const featuredCitiesData = [
  {
    id: 1,
    name: 'تهران',
    image: 'https://images.unsplash.com/photo-1570829460005-c0ac6518bed5?w=400&q=80',
    hotelCount: 245,
  },
  {
    id: 2,
    name: 'مشهد',
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&q=80',
    hotelCount: 128,
  },
  {
    id: 3,
    name: 'کیش',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
    hotelCount: 89,
  },
  {
    id: 4,
    name: 'شیراز',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80',
    hotelCount: 76,
  },
]

export default function FeaturedCities() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2 text-foreground">شهرهای برتر</h2>
        <p className="text-center text-foreground/60 mb-12">
          آماری از هتل‌های موجود در شهرهای مختلف
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCitiesData.map((city) => (
            <Link key={city.id} href={`/search?city_id=${city.id}`}>
              <Card className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 h-48 relative">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{city.name}</h3>
                  <p className="text-sm text-gray-200">{city.hotelCount} اقامتگاه</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
