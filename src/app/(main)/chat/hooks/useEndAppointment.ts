import { api } from '@/lib/api/axios'
import { useMutation } from '@tanstack/react-query'

export interface Request {
  appointmentId: number
}

export interface Response {
  message: string
}

const completeAppointment = async ({ appointmentId }: Request): Promise<Response> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${backendUrl}/booking/${appointmentId}/complete`

  const response = await api.patch(url)
  return response.data
}

export const useFinishAppointment = () => {
  return useMutation({
    mutationFn: (props: Request) => completeAppointment(props),
  })
}
