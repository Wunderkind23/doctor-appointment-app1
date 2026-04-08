import { api } from '@/lib/api/axios'
import { useMutation } from '@tanstack/react-query'

interface request {
  patientId: number
}

export interface Response {
  message: string
}

const revoke = async (data: request): Promise<Response> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL

  const url = `${backendUrl}/patient/revoke`

  const response = await api.post(url, data)

  return response.data
}

export const useRevokeAccess = () => {
  return useMutation({
    mutationFn: (data: request) => revoke(data),
  })
}
