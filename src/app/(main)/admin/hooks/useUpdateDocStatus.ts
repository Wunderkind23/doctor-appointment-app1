import { api } from '@/lib/api/axios'
import { useMutation } from '@tanstack/react-query'

export interface Response {
  message: string
}

const updateStatus = async (doctorId: number): Promise<Response> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${backendUrl}/doctor/${doctorId}/verify`

  const response = await api.post(url)
  return response.data
}

export const useUpdateDocStatus = () => {
  return useMutation({
    mutationFn: (doctorId: number) => updateStatus(doctorId),
  })
}
