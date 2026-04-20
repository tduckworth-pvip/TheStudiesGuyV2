interface NominatimResult {
  lat: string
  lon: string
  display_name: string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  if (!address?.trim()) {
    return Response.json({ error: 'address is required' }, { status: 400 })
  }

  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', address)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '1')

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': 'TheStudiesGuy/1.0 (tamlinleighduckworth@gmail.com)' },
    next: { revalidate: 86400 },
  })

  if (!res.ok) {
    return Response.json({ error: 'Geocoding service unavailable' }, { status: 502 })
  }

  const results: NominatimResult[] = await res.json()

  if (!results.length) {
    return Response.json({ error: 'Location not found' }, { status: 404 })
  }

  const { lat, lon, display_name } = results[0]
  // display_name is "City, Region, ..., Country" — last segment is the country
  const country = display_name.split(',').at(-1)?.trim() ?? ''
  return Response.json({
    lat: parseFloat(lat),
    lng: parseFloat(lon),
    displayName: display_name,
    country,
  })
}
