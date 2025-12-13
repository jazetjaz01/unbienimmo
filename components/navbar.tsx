import Link from "next/link"
import { Suspense } from "react"
import { Logo } from "@/components/logo"
import { AuthButton } from "@/components/auth-button"
import { NavigationSheet } from "@/components/navigation-sheet"
import { SearchBar } from "@/components/SearchBar"
import { TransactionToggle } from "./TransactionToogle"

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-t from-gray-100 to-white ">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">

        {/* 🔹 LIGNE 1 */}
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-semibold text-gray-900">
              unbienimmo
            </span>
          </Link>

          {/* Achat / Location */}
          <TransactionToggle />

          {/* Auth */}
          <div className="flex items-center gap-3">
            <Suspense>
              <AuthButton />
            </Suspense>

            <div className="md:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>

        {/* 🔹 LIGNE 2 */}
        <div className="pb-4 flex justify-center">
          <SearchBar />
        </div>

      </div>
    </nav>
  )
}

export default Navbar
