import { api } from '@/lib/api/axios'
import { useMutation } from '@tanstack/react-query'

interface request {
  doctorId: number
  type: string
}

export interface Response {
  message: string
}

const suspend = async (data: request): Promise<Response> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL

  const { doctorId, type } = data

  const url = `${backendUrl}/doctor/${doctorId}/suspend?type=${type}`

  const response = await api.post(url)
  return response.data
}

export const useSuspendDoc = () => {
  return useMutation({
    mutationFn: (data: request) => suspend(data),
  })
}
