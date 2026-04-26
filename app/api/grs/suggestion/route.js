// API route: /api/grs/suggestion
// Proxy for GRS suggestion endpoint with caching
import { getSuggestion } from '@/lib/grs-client'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)

    const params = {
      city_id: searchParams.get('city_id'),
      check_in: searchParams.get('check_in'),
      check_out: searchParams.get('check_out'),
      adults_count: searchParams.get('adults_count'),
      children: searchParams.getAll('children[]'),
      property_id: searchParams.get('property_id'),
      page: searchParams.get('page') || 0,
      count: searchParams.get('count') || 50,
    }

    // Parse filters if provided
    const filters = []
    let filterIndex = 0
    while (searchParams.has(`filters[${filterIndex}][name]`)) {
      filters.push({
        name: searchParams.get(`filters[${filterIndex}][name]`),
        value: searchParams.get(`filters[${filterIndex}][value]`),
        operand: searchParams.get(`filters[${filterIndex}][operand]`) || 'IsEqualTo',
      })
      filterIndex++
    }
    if (filters.length > 0) {
      params.filters = filters
    }

    const result = await getSuggestion(params)

    return Response.json(result)
  } catch (error) {
    console.error('[Suggestion API Error]', error)
    return Response.json(
      { code: 500, message: 'خطای سرور', error: [{ message: error.message }], value: null },
      { status: 500 }
    )
  }
}
