import { api } from '@/lib/api/axios'
import { useMutation } from '@tanstack/react-query'

export interface CreatePaymentRequest {
  patientId: number
  amount: number
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

const createPayment = async (props: CreatePaymentRequest) => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${backendUrl}/payment`
  const response = await api.post(url, props)
  return response.data?.data
}

export const useCreateCheckoutUrl = () => {
  return useMutation({
    mutationFn: (props: CreatePaymentRequest) => createPayment(props),
  })
}
