import { Card } from '@/components/ui/card'
import { Banknote, Clock, Headphones, Building2 } from 'lucide-react'

const features = [
  {
    icon: Banknote,
    title: 'قیمت مطمئن',
    description: 'بهترین قیمت‌ها با تضمین رضایت مشتری',
  },
  {
    icon: Clock,
    title: 'رزرو فوری',
    description: 'تأیید فوری رزرو در کمتر از ۲ دقیقه',
  },
  {
    icon: Headphones,
    title: 'پشتیبانی ۲۴ ساعته',
    description: 'تیم پشتیبانی همیشه آماده کمک',
  },
  {
    icon: Building2,
    title: 'تنوع اقامتگاه',
    description: 'انتخاب از هزاران اقامتگاه در سراسر کشور',
  },
]

export default function WhyUsSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2 text-foreground">چرا یورزرو؟</h2>
        <p className="text-center text-foreground/60 mb-12">
          ما بهترین خدمات را برای شما فراهم می‌کنیم
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <Card key={idx} className="p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Icon size={32} className="text-primary" />
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2 text-foreground">{feature.title}</h3>
                <p className="text-foreground/60 text-sm">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
