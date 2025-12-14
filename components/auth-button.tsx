'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'

import { supabasePublic } from '@/lib/supabase/supabase-public'
import { LogoutButton } from './logout-button'

export function AuthButton() {
  const [user, setUser] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await supabasePublic.auth.getUser()
        setUser(data?.user || null)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  if (loading) return <div>Loading...</div>

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant="default">
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  )
}
