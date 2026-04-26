import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">درباره ما</h3>
            <p className="text-background/80 text-sm">
              یورزرو بهترین پلتفرم برای رزرو هتل‌ها و اقامتگاه‌های ایران است.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">لینک‌های سریع</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:underline transition">
                  صفحه اصلی
                </a>
              </li>
              <li>
                <a href="/search" className="hover:underline transition">
                  جستجو
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline transition">
                  درباره ما
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline transition">
                  تماس با ما
                </a>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-bold text-lg mb-4">کمک و پشتیبانی</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline transition">
                  سوالات متداول
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline transition">
                  شرایط و ضوابط
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline transition">
                  سیاست خصوصی
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">تماس با ما</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span dir="ltr">۰۲۱-۱۲۳۴۵۶۷۸</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>info@youreserve.ir</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>تهران، خیابان فلسطین</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-background/60">
            <p>&copy; ۱۴۰۳ یورزرو. تمام حقوق محفوظ است.</p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <a href="#" className="hover:text-background transition">
                توئیتر
              </a>
              <a href="#" className="hover:text-background transition">
                اینستاگرام
              </a>
              <a href="#" className="hover:text-background transition">
                فیسبوک
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
