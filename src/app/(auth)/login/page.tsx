import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LoginForm } from '@/components/forms/LoginForm'

export const metadata: Metadata = { title: 'Sign In' }

// LoginForm uses useSearchParams — requires Suspense boundary
export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
