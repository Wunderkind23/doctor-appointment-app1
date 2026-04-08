import { api } from '@/lib/api/axios'
import { useMutation } from '@tanstack/react-query'

interface request {
  doctorId: number
  payoutId: number
}

export interface Response {
  message: string
}

const confirm = async (data: request): Promise<Response> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  const { doctorId, payoutId } = data

  const url = `${backendUrl}/payout/${payoutId}/paid`

  const response = await api.patch(url, { doctorId })
  return response.data
}

export const useConfirmPayout = () => {
  return useMutation({
    mutationFn: (data: request) => confirm(data),
  })
}
