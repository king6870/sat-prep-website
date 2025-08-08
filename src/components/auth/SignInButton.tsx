'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { LogIn, LogOut, User } from 'lucide-react'

interface SignInButtonProps {
  className?: string
}

export default function SignInButton({ className = '' }: SignInButtonProps) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className={`btn-secondary ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
      </div>
    )
  }

  if (session?.user) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span>{session.user.name}</span>
        </div>
        <button
          onClick={() => signOut()}
          className={`btn-secondary flex items-center space-x-2 ${className}`}
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => signIn('google')}
      className={`btn-primary flex items-center space-x-2 ${className}`}
    >
      <LogIn className="h-4 w-4" />
      <span>Sign In with Google</span>
    </button>
  )
}
