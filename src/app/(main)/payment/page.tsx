'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useVerifyPayment } from './hooks/useVerifyReference'
import { handleApiError } from '@/lib/errors/axios'

const PaymentCallbackContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reference = searchParams.get('reference')
  const { mutate } = useVerifyPayment()

  useEffect(() => {
    if (!reference) {
      router.replace('/payment/failed')
      return
    }

    const verify = async () => {
      mutate(
        { reference },
        {
          onSuccess: () => {
            router.replace('/payment/success')
          },
          onError: (error) => {
            handleApiError(error)
            router.replace('/payment/failed')
          },
        },
      )
    }

    verify()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference, router])

  return (
    <div className="flex h-[60vh] items-center justify-center">
      <p className="text-gray-400">Verifying payment...</p>
    </div>
  )
}

const PaymentCallbackPage = () => {
  return (
    <Suspense fallback={
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-gray-400">Loading payment verification...</p>
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  )
}

export default PaymentCallbackPage
