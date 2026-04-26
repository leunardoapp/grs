// GRS status and error message translations to Persian

export const statusTranslations = {
  pending: 'در حال بررسی',
  booking: 'آماده پرداخت',
  booked: 'تأیید شده',
  definite: 'قطعی',
  rejected: 'رد شده',
  modifying: 'در حال تغییر',
  modified: 'ویرایش شده',
  modify_booking: 'بررسی تغییرات',
  modify_rejected: 'تغییرات رد شد',
  canceling: 'در حال کنسلی',
  canceled: 'لغو شده',
  cancel_booking: 'بررسی کنسلی',
  rejected_cancellation: 'کنسلی رد شد',
  overbooking: 'ظرفیت پر',
  refund: 'استرداد وجه',
}

export const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  booking: 'bg-blue-100 text-blue-800 border-blue-300',
  booked: 'bg-green-100 text-green-800 border-green-300',
  definite: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  rejected: 'bg-red-100 text-red-800 border-red-300',
  modifying: 'bg-purple-100 text-purple-800 border-purple-300',
  modified: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  modify_booking: 'bg-purple-100 text-purple-800 border-purple-300',
  modify_rejected: 'bg-red-100 text-red-800 border-red-300',
  canceling: 'bg-orange-100 text-orange-800 border-orange-300',
  canceled: 'bg-gray-100 text-gray-800 border-gray-300',
  cancel_booking: 'bg-orange-100 text-orange-800 border-orange-300',
  rejected_cancellation: 'bg-red-100 text-red-800 border-red-300',
  overbooking: 'bg-red-100 text-red-800 border-red-300',
  refund: 'bg-green-100 text-green-800 border-green-300',
}

export const errorMessages = {
  NotEnoughCredit: 'اعتبار حساب آژانس کافی نیست',
  ReserveExpired: 'زمان رزرو منقضی شده است',
  ReserveNotExists: 'رزرو یافت نشد',
  PropertyNotExists: 'اقامتگاه یافت نشد',
  RatePlanNotExists: 'پلن فروش یافت نشد',
  reserve_room_inventory_exception: 'موجودی اتاق کافی نیست',
  reserve_room_capacity_exception: 'ظرفیت اتاق بیش از حد مجاز است',
  reserve_room_rate_not_valid_exception: 'نرخ اتاق معتبر نیست',
  reserve_room_stay_not_in_range_exception: 'تعداد شب‌های رزرو با قوانین هتل مطابقت ندارد',
  reserve_room_closed_exception: 'اتاق بسته است',
  reserve_room_without_rate_exception: 'نرخی برای این اتاق و تاریخ وجود ندارد',
  StayNotInRange: 'تعداد شب‌های رزرو معتبر نیست',
  RoomTypeNotExists: 'نوع اتاق یافت نشد',
  'validation.after_or_equal': 'تاریخ ورود باید امروز یا بعد از آن باشد',
  'validation.required': 'این فیلد ضروری است',
  CloseToArrivalException: 'رزرو برای تاریخ نزدیک به ورود غیرممکن است',
  CloseToDepartureException: 'رزرو برای تاریخ نزدیک به خروج غیرممکن است',
  NotAcceptableInThisStatus: 'این عمل در این وضعیت امکان‌پذیر نیست',
  PropertyChangeNotAcceptableException: 'تغییر اقامتگاه ممکن نیست',
  RatePlanUnacceptableCountryId: 'این پلن برای شهروندان کشور شما موجود نیست',
  ReserveRoomCapacity: 'ظرفیت اتاق مطابقت ندارد',
}

/**
 * Get Persian translation of status
 */
export function getStatusPersian(status) {
  return statusTranslations[status] || status
}

/**
 * Get color classes for status badge
 */
export function getStatusColorClasses(status) {
  return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300'
}

/**
 * Get Persian error message
 */
export function getErrorMessagePersian(errorCode) {
  return errorMessages[errorCode] || errorCode || 'خطای ناشناخته'
}

/**
 * Reservation status flow stages (for stepper)
 */
export const reservationStages = [
  { key: 'pending', label: 'بررسی', icon: 'hourglass' },
  { key: 'booking', label: 'پرداخت', icon: 'credit-card' },
  { key: 'booked', label: 'تأیید', icon: 'check' },
  { key: 'definite', label: 'قطعی', icon: 'check-circle' },
]

/**
 * Get stage index for current status
 */
export function getStageIndex(status) {
  const stageMap = {
    pending: 0,
    booking: 1,
    booked: 2,
    definite: 3,
    modified: 3,
  }
  return stageMap[status] || -1
}

/**
 * Payment status translations
 */
export const paymentStatusTranslations = {
  PENDING: 'در انتظار',
  SUCCESS: 'موفق',
  FAILED: 'ناموفق',
  REFUNDED: 'بازگردانده شده',
}

export function getPaymentStatusPersian(status) {
  return paymentStatusTranslations[status] || status
}

/**
 * User role translations
 */
export const roleTranslations = {
  CUSTOMER: 'مشتری',
  ADMIN: 'مدیر',
  OPERATOR: 'اپراتور',
}

export function getRolePersian(role) {
  return roleTranslations[role] || role
}

/**
 * Meal plan translations
 */
export const mealPlanTranslations = {
  'no-meal': 'بدون وعده',
  breakfast: 'صبحانه',
  half_board: 'هافبرد',
  full_board: 'فول بورد',
  all_inclusive: 'همه شامل',
}

export function getMealPlanPersian(mealType) {
  return mealPlanTranslations[mealType] || mealType
}

/**
 * Bed type translations
 */
export const bedTypeTranslations = {
  single: 'تخت یکی',
  double: 'تخت دو نفره',
  twin: 'تخت دو تک',
  sofa: 'مبل',
  bunk: 'تخت کمپینگی',
}

export function getBedTypePersian(bedType) {
  return bedTypeTranslations[bedType] || bedType
}
