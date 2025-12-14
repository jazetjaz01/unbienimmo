'use client'

import { useRouter } from 'next/navigation'
import { SearchBar, SearchParams } from './SearchBar'

export function SearchBarClient() {
  const router = useRouter()

  const handleSearch = (params: SearchParams) => {
    const query = new URLSearchParams()

    if (params.city) query.set('city', params.city)
    if (params.propertyType) query.set('propertyType', params.propertyType)
    if (params.minPrice) query.set('minPrice', params.minPrice)
    if (params.maxPrice) query.set('maxPrice', params.maxPrice)

    router.push(`/search?${query.toString()}`)
  }

  return <SearchBar onSearch={handleSearch} />
}
