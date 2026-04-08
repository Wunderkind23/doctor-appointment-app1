'use client'

import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const PaymentFailedPage = () => {
  const router = useRouter()

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center text-center gap-6">
      <XCircle className="h-16 w-16 text-red-500" />
      <h2 className="text-2xl font-bold text-white">Payment Failed</h2>
      <p className="text-gray-400">We couldn’t verify your payment.</p>
      <Button variant="destructive" onClick={() => router.push('/pricing')}>
        Try Again
      </Button>
    </div>
  )
}

export default PaymentFailedPage
