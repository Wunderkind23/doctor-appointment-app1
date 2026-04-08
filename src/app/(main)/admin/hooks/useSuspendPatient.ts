import { api } from '@/lib/api/axios'
import { useMutation } from '@tanstack/react-query'

interface request {
  patientId: number
  type: string
}

export interface Response {
  message: string
}

const suspend = async (data: request): Promise<Response> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL

  const url = `${backendUrl}/patient/suspend`

  const response = await api.post(url, data)

  return response.data
}

export const useSuspend = () => {
  return useMutation({
    mutationFn: (data: request) => suspend(data),
  })
}
