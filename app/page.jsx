'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search, MapPin, Users, Calendar, Plus, X } from 'lucide-react'
import { toPersianDigits } from '@/lib/persian-utils'
import HeroSection from './components/hero-section'
import FeaturedCities from './components/featured-cities'
import FeaturedHotels from './components/featured-hotels'
import WhyUsSection from './components/why-us-section'
import Footer from './components/footer'

export default function HomePage() {
  const router = useRouter()
  const [searchData, setSearchData] = useState({
    cityId: '',
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: [],
  })

  const [showChildrenAges, setShowChildrenAges] = useState(false)

  const handleSearch = () => {
    const params = new URLSearchParams({
      city_id: searchData.cityId,
      check_in: searchData.checkIn,
      check_out: searchData.checkOut,
      adults_count: searchData.adults,
    })

    searchData.children.forEach((age) => {
      if (age) params.append('children[]', age)
    })

    router.push(`/search?${params.toString()}`)
  }

  const addChild = () => {
    setSearchData({
      ...searchData,
      children: [...searchData.children, ''],
    })
  }

  const removeChild = (index) => {
    setSearchData({
      ...searchData,
      children: searchData.children.filter((_, i) => i !== index),
    })
  }

  const updateChildAge = (index, age) => {
    const newChildren = [...searchData.children]
    newChildren[index] = age
    setSearchData({
      ...searchData,
      children: newChildren,
    })
  }

  return (
    <div dir="rtl" className="bg-background text-foreground">
      {/* Hero Section with Search */}
      <HeroSection>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10" />
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Search Card with Glass Effect */}
            <Card className="backdrop-blur-md bg-white/95 shadow-2xl border-0 p-8 rounded-2xl">
              <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2 text-primary">
                یورزرو
              </h1>
              <p className="text-center text-foreground/70 mb-8">
                بهترین هتل‌ها را با کمترین قیمت رزرو کنید
              </p>

              <div className="space-y-6">
                {/* City Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">شهر</label>
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3 border border-border">
                    <MapPin size={20} className="text-primary flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="شهر مورد نظر را انتخاب کنید"
                      value={searchData.cityId}
                      onChange={(e) => setSearchData({ ...searchData, cityId: e.target.value })}
                      className="flex-1 bg-transparent outline-none text-right"
                    />
                  </div>
                </div>

                {/* Dates and Guests */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Check In */}
                  <div>
                    <label className="block text-sm font-medium mb-2">تاریخ ورود</label>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3 border border-border">
                      <Calendar size={20} className="text-primary flex-shrink-0" />
                      <input
                        type="date"
                        value={searchData.checkIn}
                        onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
                        className="flex-1 bg-transparent outline-none text-right"
                      />
                    </div>
                  </div>

                  {/* Check Out */}
                  <div>
                    <label className="block text-sm font-medium mb-2">تاریخ خروج</label>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3 border border-border">
                      <Calendar size={20} className="text-primary flex-shrink-0" />
                      <input
                        type="date"
                        value={searchData.checkOut}
                        onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
                        className="flex-1 bg-transparent outline-none text-right"
                      />
                    </div>
                  </div>

                  {/* Adults */}
                  <div>
                    <label className="block text-sm font-medium mb-2">بزرگسالان</label>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3 border border-border">
                      <Users size={20} className="text-primary flex-shrink-0" />
                      <select
                        value={searchData.adults}
                        onChange={(e) =>
                          setSearchData({ ...searchData, adults: parseInt(e.target.value) })
                        }
                        className="flex-1 bg-transparent outline-none text-right"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <option key={n} value={n}>
                            {toPersianDigits(n.toString())}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Children Section */}
                {searchData.children.length > 0 && (
                  <div className="border-t border-border pt-4">
                    <label className="block text-sm font-medium mb-3">سن کودکان</label>
                    <div className="space-y-2">
                      {searchData.children.map((age, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="17"
                            value={age}
                            onChange={(e) => updateChildAge(idx, e.target.value)}
                            placeholder="سن کودک"
                            className="flex-1 px-3 py-2 border border-border rounded-lg outline-none text-right"
                          />
                          <button
                            onClick={() => removeChild(idx)}
                            className="p-2 hover:bg-red-50 rounded-lg transition"
                          >
                            <X size={18} className="text-red-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Child Button */}
                {searchData.children.length < 5 && (
                  <button
                    onClick={addChild}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 transition text-sm font-medium"
                  >
                    <Plus size={16} />
                    افزودن کودک
                  </button>
                )}

                {/* Search Button */}
                <Button
                  onClick={handleSearch}
                  disabled={!searchData.cityId || !searchData.checkIn || !searchData.checkOut}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-bold text-lg transition"
                >
                  <Search size={20} className="ml-2" />
                  جستجو
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </HeroSection>

      {/* Featured Cities */}
      <FeaturedCities />

      {/* Featured Hotels */}
      <FeaturedHotels />

      {/* Why Us Section */}
      <WhyUsSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
