import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api/axios'

/**
 * payout Request
 */
export interface payoutRequestAttributeI {
  bankName: string
  accountName: string
  accountNumber: string
  amount: number
  doctorId: number
}

/**
 * payout Response
 */
export interface Response {
  message: string
}

const payRequest = async (props: payoutRequestAttributeI) => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${backendUrl}/doctor/payout`
  const response = await api.post(url, props)
  return response.data
}

export const usePayoutRequest = () => {
  return useMutation({
    mutationFn: (props: payoutRequestAttributeI) => payRequest(props),
  })
}
