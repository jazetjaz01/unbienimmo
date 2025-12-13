'use client'

import * as React from 'react'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'

type Segment = 'location' | 'type' | 'budget' | null
type TransactionType = 'achat' | 'location'

export function SearchBar() {
  const [transactionType, setTransactionType] =
    React.useState<TransactionType>('achat')

  const [location, setLocation] = React.useState('')
  const [propertyType, setPropertyType] = React.useState('')
  const [minPrice, setMinPrice] = React.useState('')
  const [activeSegment, setActiveSegment] = React.useState<Segment>(null)

  const handleSearch = () => {
    console.log({
      transactionType,
      location,
      propertyType,
      minPrice,
    })
  }

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
          relative flex flex-col justify-center px-6 py-2 cursor-pointer
          transition-all duration-200
          rounded-full
          ${isActive ? 'bg-gray-100 shadow-md' : 'hover:bg-gray-50'}
        `}
      >
        <span className="text-[11px] font-semibold text-gray-800">{label}</span>

        <Input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="
            border-none p-0 h-auto bg-transparent
            text-sm text-gray-700
            focus:ring-0 focus:outline-none
          "
        />

        {showDivider && (
          <div className="absolute right-0 top-1/2 h-6 w-px bg-gray-200 -translate-y-1/2" />
        )}
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* 🔥 ONGLET ACHAT / LOCATION */}
      <div className="flex gap-8 relative">
        {(['achat', 'location'] as TransactionType[]).map((type) => {
          const isActive = transactionType === type
          return (
            <button
              key={type}
              onClick={() => setTransactionType(type)}
              className="flex flex-row items-center gap-2 pb-2 cursor-pointer relative"
            >
              <Image src={`/${type}.svg`} alt={type} width={22} height={22} />
              <span
                className={`
                  text-sm font-medium capitalize
                  ${isActive ? 'text-black' : 'text-gray-500'}
                  transition-colors duration-200
                `}
              >
                {type}
              </span>

              {/* Ligne noire animée slide sous texte */}
              {isActive && (
                <motion.div
                  layoutId="underline"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-black rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* 🔍 BARRE DE RECHERCHE */}
      <div
        className="
          flex items-center
          h-16
          bg-white
          rounded-full
          border
          shadow-md
          hover:shadow-xl
          transition-shadow
          max-w-3xl
          w-full
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
            onClick={handleSearch}
            className="
              h-12 w-12 rounded-full
              bg-rose-600 hover:bg-rose-700
              flex items-center justify-center
              shadow-md hover:shadow-lg
              transition-shadow duration-300
            "
          >
            <Search className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  )
}
