// Persian date and number formatting utilities
import dayjs from 'jalali-moment'

// Persian digits
const persianDigits = '۰۱۲۳۴۵۶۷۸۹'
const englishDigits = '0123456789'

/**
 * Convert English digits to Persian
 */
export function toPersianDigits(str) {
  if (!str) return ''
  return str.toString().replace(/\d/g, (d) => persianDigits[d])
}

/**
 * Convert Persian digits to English
 */
export function toEnglishDigits(str) {
  if (!str) return ''
  return str.toString().replace(/[۰-۹]/g, (d) => englishDigits[persianDigits.indexOf(d)])
}

/**
 * Format number with Persian comma separator and convert digits
 */
export function formatPrice(price) {
  if (!price) return '۰'
  const formatted = Math.floor(price / 10)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return toPersianDigits(formatted)
}

/**
 * Format Jalali date
 */
export function formatJalaliDate(date, format = 'jYYYY/jMM/jDD') {
  if (!date) return ''
  return dayjs(date).format(format)
}

/**
 * Get Jalali date parts
 */
export function getJalaliDateParts(date) {
  const d = dayjs(date)
  return {
    year: d.jYear(),
    month: d.jMonth() + 1,
    day: d.jDate(),
  }
}

/**
 * Parse Persian date to ISO string
 */
export function parseJalaliToISO(jDate) {
  if (!jDate) return null
  const d = dayjs(jDate, 'jYYYY/jMM/jDD')
  return d.toISOString()
}

/**
 * Get number of nights between two dates
 */
export function getNights(checkIn, checkOut) {
  const start = dayjs(checkIn)
  const end = dayjs(checkOut)
  return end.diff(start, 'day')
}

/**
 * Persian month names
 */
export const persianMonths = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
]

/**
 * Get Persian month name
 */
export function getPersianMonthName(monthIndex) {
  return persianMonths[monthIndex] || ''
}

/**
 * Format reservation dates display
 */
export function formatReservationDates(checkIn, checkOut) {
  const start = formatJalaliDate(checkIn, 'jD jMMMM')
  const end = formatJalaliDate(checkOut, 'jD jMMMM')
  return `${start} تا ${end}`
}

/**
 * Check if date is today
 */
export function isToday(date) {
  return dayjs(date).isSame(dayjs(), 'day')
}

/**
 * Check if date is tomorrow
 */
export function isTomorrow(date) {
  return dayjs(date).isSame(dayjs().add(1, 'day'), 'day')
}

/**
 * Get time until date (for countdown)
 */
export function getTimeUntil(futureDate) {
  const now = dayjs()
  const future = dayjs(futureDate)
  const diff = future.diff(now)

  if (diff <= 0) {
    return null
  }

  const duration = dayjs.duration(diff)
  return {
    hours: Math.floor(duration.asHours()),
    minutes: duration.minutes(),
    seconds: duration.seconds(),
  }
}

/**
 * Format currency in Rials with Persian digits
 */
export function formatCurrency(amount) {
  if (!amount) return '۰ تومان'
  const rials = amount / 10 // Convert to Rials from smallest unit
  const formatted = Math.floor(rials)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return toPersianDigits(formatted) + ' تومان'
}

/**
 * Alias for formatJalaliDate
 */
export function formatPersianDate(date, format = 'jYYYY/jMM/jDD HH:mm') {
  return formatJalaliDate(date, format)
}
