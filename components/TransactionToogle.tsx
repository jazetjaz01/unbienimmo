'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'

type TransactionType = 'achat' | 'location'

export function TransactionToggle() {
  const [active, setActive] = useState<TransactionType>('achat')

  return (
    <div className="flex items-center gap-8 relative">
      {(['achat', 'location'] as TransactionType[]).map((type) => {
        const isActive = active === type

        return (
          <button
            key={type}
            onClick={() => setActive(type)}
            className="relative flex items-center gap-2 pb-1"
          >
            <Image
              src={`/${type}.svg`}
              alt={type}
              width={22}
              height={22}
            />

            <span
              className={`
                text-sm font-medium capitalize
                ${isActive ? 'text-black' : 'text-gray-500'}
              `}
            >
              {type}
            </span>

            {isActive && (
              <motion.div
                layoutId="transaction-underline"
                className="absolute -bottom-1 left-0 right-0 h-[2px] bg-black rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
