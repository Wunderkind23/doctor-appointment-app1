import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api/axios'

/**
 * Book Appointment Response
 */
export interface AddNoteResponse {
  message: string
}

const cancelBooking = async (id: number): Promise<AddNoteResponse> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${backendUrl}/booking/${id}/cancel`

  const response = await api.patch(url)

  return response.data?.data
}

export const useCancelAppointment = (id: number) => {
  return useMutation({
    mutationFn: () => cancelBooking(id),
  })
}
