import { api } from '@/lib/api/axios'
import { useMutation } from '@tanstack/react-query'

interface request {
  id: number
  rating: number
  comment: string
  patientId: number
  doctorId: number
}

export interface Response {
  message: string
}

const addRating = async (data: request): Promise<Response> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL

  const url = `${backendUrl}/rating`

  const response = await api.post(url, data)

  return response.data
}

export const useAddRating = () => {
  return useMutation({
    mutationFn: (data: request) => addRating(data),
  })
}
