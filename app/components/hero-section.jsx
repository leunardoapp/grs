// Hero Section Component
import Image from 'next/image'

export default function HeroSection({ children }) {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1566521159313-3f4ff2cfd147?w=1600&q=80"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      {children}
    </div>
  )
}
