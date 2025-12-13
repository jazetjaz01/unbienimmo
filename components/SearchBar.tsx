'use client'

import * as React from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Segment = 'location' | 'type' | 'budget' | null

export function SearchBar() {
  const [location, setLocation] = React.useState('')
  const [propertyType, setPropertyType] = React.useState('')
  const [minPrice, setMinPrice] = React.useState('')
  const [activeSegment, setActiveSegment] = React.useState<Segment>(null)

  const SegmentWrapper = ({
    label,
    placeholder,
    value,
    onChange,
    segment,
    showDivider = true,
  }: {
    label: string
    placeholder: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    segment: Segment
    showDivider?: boolean
  }) => {
    const isActive = activeSegment === segment

    return (
      <div
        onClick={() => setActiveSegment(segment)}
        className={`
          relative flex flex-col justify-center px-6 py-2
          cursor-pointer rounded-full transition
          ${isActive ? 'bg-gray-100 shadow-md' : 'hover:bg-gray-50'}
        `}
      >
        <span className="text-[11px] font-semibold text-gray-800">
          {label}
        </span>

        <Input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="
            border-none p-0 h-auto bg-transparent
            text-sm text-gray-700
            focus:outline-none focus:ring-0
          "
        />

        {showDivider && (
          <div className="absolute right-0 top-1/2 h-6 w-px bg-gray-200 -translate-y-1/2" />
        )}
      </div>
    )
  }

  return (
    <div
      className="
        flex items-center
        h-16 bg-white
        rounded-full border
        shadow-md hover:shadow-xl
        transition-shadow
        w-full max-w-3xl
      "
    >
      <SegmentWrapper
        label="Ville"
        placeholder="Où allez-vous ?"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        segment="location"
      />

      <SegmentWrapper
        label="Type"
        placeholder="Appartement, maison…"
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value)}
        segment="type"
      />

      <SegmentWrapper
        label="Budget"
        placeholder="Prix minimum"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        segment="budget"
        showDivider={false}
      />

      <div className="px-3">
        <Button
          className="
            h-12 w-12 rounded-full
            bg-rose-600 hover:bg-rose-700
            flex items-center justify-center
            shadow-md
          "
        >
          <Search className="h-5 w-5 text-white" />
        </Button>
      </div>
    </div>
  )
}
