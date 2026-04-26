// GRS API Client - Centralized proxy for all GRS endpoints
// This client should ONLY be used server-side via Next.js API routes

const GRS_BASE_URL = process.env.GRS_HOST_URL || 'https://api.grs.ir'
const GRS_TOKEN = process.env.GRS_CLIENT_TOKEN

if (!GRS_TOKEN) {
  throw new Error('GRS_CLIENT_TOKEN environment variable is not set')
}

const grsHeaders = {
  'Client-Token': GRS_TOKEN,
  'Content-Type': 'application/json',
}

/**
 * Helper function to make GRS API requests
 * All responses follow GRS schema: { code, message, error, value }
 */
async function callGrsApi(method, endpoint, body = null) {
  const url = `${GRS_BASE_URL}${endpoint}`
  const options = {
    method,
    headers: grsHeaders,
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(url, options)
    const data = await response.json()

    // Log for debugging (remove sensitive data)
    if (data.code !== 200) {
      console.error('[GRS Error]', endpoint, data)
    }

    return data
  } catch (error) {
    console.error('[GRS Fetch Error]', endpoint, error)
    throw error
  }
}

// ===== CITIES & LOCATIONS =====

export async function getCities(offset = 0, count = 100) {
  return callGrsApi('GET', `/v1/cities?offset=${offset}&count=${count}`)
}

export async function getFacilities(offset = 0, count = 100) {
  return callGrsApi('GET', `/v1/facilities?offset=${offset}&count=${count}`)
}

// ===== PROPERTIES & ROOMS =====

export async function getProperties(filters = [], page = 0, count = 50) {
  let url = `/v1/properties?page=${page}&count=${count}`
  filters.forEach((filter, index) => {
    url += `&filters[${index}][name]=${filter.name}&filters[${index}][value]=${filter.value}&filters[${index}][operand]=${filter.operand || 'IsEqualTo'}`
  })
  return callGrsApi('GET', url)
}

export async function getPropertyDetails(propertyId) {
  return callGrsApi('GET', `/v1/properties/${propertyId}`)
}

export async function getRoomTypes(propertyId) {
  return callGrsApi('GET', `/v1/room-types?property_id=${propertyId}`)
}

export async function getAvailableRooms(propertyId, checkIn, checkOut) {
  return callGrsApi('GET', `/v1/available-rooms?property_id=${propertyId}&check_in=${checkIn}&check_out=${checkOut}`)
}

// ===== SEARCH & SUGGESTION =====

export async function getSuggestion(params) {
  // params: { city_id, check_in, check_out, adults_count, children, filters, page, count, orders }
  let url = '/v1/suggestion?'
  const queryParts = []

  if (params.city_id) queryParts.push(`city_id=${params.city_id}`)
  if (params.check_in) queryParts.push(`check_in=${params.check_in}`)
  if (params.check_out) queryParts.push(`check_out=${params.check_out}`)
  if (params.adults_count) queryParts.push(`adults_count=${params.adults_count}`)
  if (params.children && params.children.length) {
    params.children.forEach((age, idx) => {
      if (age) queryParts.push(`children[${idx}]=${age}`)
    })
  }
  if (params.property_id) queryParts.push(`property_id=${params.property_id}`)

  if (params.filters && params.filters.length) {
    params.filters.forEach((filter, index) => {
      queryParts.push(`filters[${index}][name]=${filter.name}`)
      queryParts.push(`filters[${index}][value]=${filter.value}`)
      queryParts.push(`filters[${index}][operand]=${filter.operand || 'IsEqualTo'}`)
    })
  }

  if (params.page !== undefined) queryParts.push(`page=${params.page}`)
  if (params.count) queryParts.push(`count=${params.count}`)

  url += queryParts.join('&')
  return callGrsApi('GET', url)
}

// ===== RESERVATIONS =====

export async function createReserve(reserveData) {
  // reserveData structure from GRS API:
  // { property_id, check_in, check_out, booker_first_name, booker_last_name, booker_phone, booker_email, rooms: [...], vehicle, vehicle_number, description }
  return callGrsApi('POST', '/v1/reserve', reserveData)
}

export async function extendExpiredTime(confirmationCode) {
  return callGrsApi('POST', `/v1/extended-expired-time/${confirmationCode}`, {})
}

export async function bookReserve(confirmationCode) {
  return callGrsApi('POST', '/v1/book', { confirmation_code: confirmationCode })
}

export async function modifyReserve(confirmationCode, reserveData) {
  return callGrsApi('POST', `/v1/modify/${confirmationCode}`, reserveData)
}

export async function acceptModifyReserve(confirmationCode) {
  return callGrsApi('POST', `/v1/accept-modify/${confirmationCode}`, {})
}

export async function cancelModifyReserve(confirmationCode) {
  return callGrsApi('POST', `/v1/cancel-modify/${confirmationCode}`, {})
}

export async function cancelReserve(confirmationCode) {
  return callGrsApi('POST', '/v1/cancel', { confirmation_code: confirmationCode })
}

export async function acceptCancelReserve(confirmationCode) {
  return callGrsApi('POST', `/v1/accept-cancel/${confirmationCode}`, {})
}

export async function rejectCancelReserve(confirmationCode) {
  return callGrsApi('POST', `/v1/reject-cancel/${confirmationCode}`, {})
}

// ===== RESERVE DETAILS & ACTIVITIES =====

export async function getReserveDetails(confirmationCode) {
  return callGrsApi('GET', `/v1/reserve-details?confirmation_code=${confirmationCode}`)
}

export async function getReservesList(filters = [], page = 0, count = 50) {
  let url = `/v1/reserves?page=${page}&count=${count}`
  filters.forEach((filter, index) => {
    url += `&filters[${index}][name]=${filter.name}&filters[${index}][value]=${filter.value}&filters[${index}][operand]=${filter.operand || 'IsEqualTo'}`
  })
  return callGrsApi('GET', url)
}

export async function getReserveActivities(confirmationCode) {
  return callGrsApi('GET', `/v1/reserves/${confirmationCode}/activities`)
}

export async function createReserveActivity(confirmationCode, description) {
  return callGrsApi('POST', `/v1/reserves/${confirmationCode}/activities/create`, { description })
}

export async function requestReserveService(confirmationCode, type, data, description) {
  return callGrsApi('POST', `/v1/request-service/${confirmationCode}`, { type, data, description })
}

// ===== WEBHOOKS =====

export async function getWebhook() {
  return callGrsApi('GET', '/v1/web-hook')
}

export async function setWebhook(webhookUrl) {
  return callGrsApi('POST', '/v1/web-hook', { web_hook: webhookUrl })
}

// ===== TRANSACTIONS & RECEIPTS =====

export async function getAccountTransactions(filters = []) {
  let url = '/v1/accounting-transactions'
  if (filters.length) {
    url += '?'
    filters.forEach((filter, index) => {
      url += `&filters[${index}][name]=${filter.name}&filters[${index}][value]=${filter.value}&filters[${index}][operand]=${filter.operand || 'IsEqualTo'}`
    })
  }
  return callGrsApi('GET', url)
}

export async function getReceipts(filters = []) {
  let url = '/v1/receipts'
  if (filters.length) {
    url += '?'
    filters.forEach((filter, index) => {
      url += `&filters[${index}][name]=${filter.name}&filters[${index}][value]=${filter.value}&filters[${index}][operand]=${filter.operand || 'IsEqualTo'}`
    })
  }
  return callGrsApi('GET', url)
}

export async function getReceipt(id) {
  return callGrsApi('GET', `/v1/receipts/${id}`)
}

export async function requestPayment(amount, paymentMethod, redirectUrl) {
  return callGrsApi('POST', '/v1/receipts/payment-request', {
    amount,
    payment_method: paymentMethod,
    redirect_url: redirectUrl,
  })
}

// ===== PROFILE & USERS =====

export async function getProfile() {
  return callGrsApi('GET', '/v1/profile')
}

export async function getUsers(filters = []) {
  let url = '/v1/users'
  if (filters.length) {
    url += '?'
    filters.forEach((filter, index) => {
      url += `filters[${index}][name]=${filter.name}&filters[${index}][value]=${filter.value}&filters[${index}][operand]=${filter.operand || 'IsEqualTo'}`
    })
  }
  return callGrsApi('GET', url)
}

export async function createUser(roleId, fullName, mobile, email, password) {
  return callGrsApi('POST', '/v1/users/create', {
    role_id: roleId,
    full_name: fullName,
    mobile,
    email,
    password,
  })
}

export async function getRoles() {
  return callGrsApi('GET', '/v1/roles')
}

// ===== PROMOTIONS =====

export async function getPromotions(filters = []) {
  let url = '/v1/promotions'
  if (filters.length) {
    url += '?'
    filters.forEach((filter, index) => {
      url += `filters[${index}][name]=${filter.name}&filters[${index}][value]=${filter.value}&filters[${index}][operand]=${filter.operand || 'IsEqualTo'}`
    })
  }
  return callGrsApi('GET', url)
}

export async function getPromotion(id) {
  return callGrsApi('GET', `/v1/promotions/${id}`)
}

/**
 * Helper to check if GRS response is successful
 */
export function isGrsSuccess(response) {
  return response && response.code === 200 && response.value
}

/**
 * Helper to extract error messages from GRS response
 */
export function getGrsErrorMessage(response) {
  if (!response) return 'خطای ناشناخته'
  if (response.message) return response.message
  if (response.error && Array.isArray(response.error) && response.error.length > 0) {
    return response.error[0].message || response.error[0].name
  }
  return response.code === 200 ? 'موفق' : `خطا: ${response.code}`
}
