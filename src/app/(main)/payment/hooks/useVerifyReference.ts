import { api } from '@/lib/api/axios'
import { useMutation } from '@tanstack/react-query'

export interface VerifyPaymentRequest {
  reference: string
}

export enum PaymentStatusEnum {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export interface PaymentResponse {
  message: string
  data: {
    id: number
    patientId: number
    email: string
    reference: string
    paymentLink: string
    accessCode: string
    status: PaymentStatusEnum
  }
}

const verifyReference = async (props: VerifyPaymentRequest) => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${backendUrl}/payment/verify`
  const response = await api.post(url, props)

  return response.data?.data
}

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: (props: VerifyPaymentRequest) => verifyReference(props),
  })
}
