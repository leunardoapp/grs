'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Star, MapPin, Loader } from 'lucide-react'
import { formatPrice, toPersianDigits } from '@/lib/persian-utils'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    stars: [],
    priceRange: [0, 5000000],
    sortBy: 'price',
  })

  const cityId = searchParams.get('city_id')
  const checkIn = searchParams.get('check_in')
  const checkOut = searchParams.get('check_out')
  const adultsCount = searchParams.get('adults_count')

  useEffect(() => {
    fetchResults()
  }, [searchParams, filters])

  const fetchResults = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        city_id: cityId,
        check_in: checkIn,
        check_out: checkOut,
        adults_count: adultsCount,
        count: 50,
      })

      if (filters.stars.length > 0) {
        filters.stars.forEach((star) => {
          params.append(`filters[]`, JSON.stringify({ name: 'star', value: star, operand: 'IsEqualTo' }))
        })
      }

      const response = await fetch(`/api/grs/suggestion?${params.toString()}`)
      const data = await response.json()

      if (data.code === 200 && data.value?.suggestions) {
        let filtered = data.value.suggestions

        // Apply price filter
        filtered = filtered.filter((hotel) => {
          const price = hotel.room_types?.[0]?.rate_plans?.[0]?.price || 0
          return price >= filters.priceRange[0] && price <= filters.priceRange[1]
        })

        // Apply sorting
        if (filters.sortBy === 'price') {
          filtered.sort(
            (a, b) =>
              (a.room_types?.[0]?.rate_plans?.[0]?.price || 0) -
              (b.room_types?.[0]?.rate_plans?.[0]?.price || 0)
          )
        } else if (filters.sortBy === 'star') {
          filtered.sort((a, b) => (b.star || 0) - (a.star || 0))
        }

        setResults(filtered)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div dir="rtl" className="bg-background min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20">
              <h2 className="font-bold text-lg mb-6 text-foreground">فیلترها</h2>

              {/* Star Rating */}
              <div className="mb-6">
                <h3 className="font-semibold text-sm mb-3 text-foreground">ستاره</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <label key={star} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={filters.stars.includes(star)}
                        onCheckedChange={(checked) => {
                          setFilters({
                            ...filters,
                            stars: checked
                              ? [...filters.stars, star]
                              : filters.stars.filter((s) => s !== star),
                          })
                        }}
                      />
                      <span className="text-sm text-foreground/70 flex items-center gap-1">
                        {[...Array(star)].map((_, i) => (
                          <Star key={i} size={14} className="fill-secondary text-secondary" />
                        ))}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6 pb-6 border-b border-border">
                <h3 className="font-semibold text-sm mb-3 text-foreground">محدوده قیمت</h3>
                <div className="space-y-2">
                  <Slider
                    min={0}
                    max={5000000}
                    step={100000}
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-foreground/60">
                    <span>{formatPrice(filters.priceRange[0])} تومان</span>
                    <span>{formatPrice(filters.priceRange[1])} تومان</span>
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="font-semibold text-sm mb-3 text-foreground">مرتب‌سازی</h3>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm outline-none"
                >
                  <option value="price">قیمت: کم به زیاد</option>
                  <option value="star">ستاره: بیشترین</option>
                </select>
              </div>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Result Count */}
            <div className="mb-6">
              <p className="text-foreground/60">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader size={16} className="animate-spin" />
                    در حال جستجو...
                  </span>
                ) : (
                  <span>{toPersianDigits(results.length.toString())} اقامتگاه یافت شد</span>
                )}
              </p>
            </div>

            {/* Results Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader className="animate-spin text-primary" size={32} />
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {results.map((hotel) => {
                  const lowestPrice = hotel.room_types?.[0]?.rate_plans?.[0]?.price || 0
                  return (
                    <Link key={hotel.id} href={`/hotel/${hotel.id}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer grid grid-cols-1 sm:grid-cols-3">
                        {/* Image */}
                        <div className="relative h-48 sm:h-auto sm:col-span-1 bg-gray-200">
                          <Image
                            src={
                              hotel.images?.[0]?.url ||
                              'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80'
                            }
                            alt={hotel.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Content */}
                        <div className="sm:col-span-2 p-6 flex flex-col justify-between">
                          <div>
                            {/* Name */}
                            <h3 className="text-xl font-bold mb-2 text-foreground">
                              {hotel.name}
                            </h3>

                            {/* Address */}
                            <div className="flex items-start gap-2 text-foreground/60 text-sm mb-3">
                              <MapPin size={14} className="mt-1 flex-shrink-0" />
                              <span>{hotel.address}</span>
                            </div>

                            {/* Rating and Amenities */}
                            <div className="flex items-center gap-4 mb-4">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className={`${
                                      i < (hotel.star || 0)
                                        ? 'fill-secondary text-secondary'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                {hotel.grade || 'عالی'}
                              </span>
                            </div>

                            {/* Amenities */}
                            <div className="flex gap-2 flex-wrap mb-4">
                              {hotel.facilities?.slice(0, 3).map((facility, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                >
                                  {facility.name}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Price and Button */}
                          <div className="flex items-center justify-between pt-4 border-t border-border">
                            <div>
                              <p className="text-xs text-foreground/60">قیمت شروع</p>
                              <p className="text-lg font-bold text-primary">
                                {formatPrice(lowestPrice)} تومان
                              </p>
                            </div>
                            <Button className="bg-primary hover:bg-primary/90">
                              مشاهده اتاق‌ها
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-foreground/60 text-lg">نتیجه‌ای یافت نشد</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
