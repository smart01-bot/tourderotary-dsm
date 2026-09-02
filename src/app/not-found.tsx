import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center px-6 text-center">
      <p className="text-gold font-black text-8xl mb-4">404</p>
      <h1 className="text-white text-2xl font-bold mb-2">Page not found</h1>
      <p className="text-white/50 mb-8 max-w-sm">
        This route doesn't exist. You may have taken a wrong turn on the course.
      </p>
      <Link href="/">
        <Button variant="primary" size="lg">Back to home</Button>
      </Link>
    </div>
  )
}
