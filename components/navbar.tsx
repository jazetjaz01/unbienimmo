'use client'

import * as React from 'react'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { AuthButton } from '@/components/auth-button'
import { NavigationSheet } from '@/components/navigation-sheet'
import { SearchBarClient } from '@/components/SearchBarClient'
import { Suspense } from 'react'
export default function Navbar() {
  return (
    <nav className="bg-gradient-to-t from-gray-100 to-white">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 p-2">

        {/* Ligne 1 : Logo + Auth + Menu mobile */}
        <div className="h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-semibold hidden md:block">unbienimmo</span>
          </Link>
<SearchBarClient />
          <div className="flex items-center gap-3">
            <Suspense>
            <AuthButton />
            </Suspense>
            
          </div>
        </div>

       

      </div>
    </nav>
  )
}
