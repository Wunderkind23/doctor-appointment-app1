import { api } from '@/lib/api/axios'
import { useMutation } from '@tanstack/react-query'
import { BookingAttributeI, BookingResponse } from '../../doctors/hooks/userCreateBooking'

export enum BookingTypeEnum {
  CALL = 'CALL',
  VIDEO = 'VIDEO',
  CHAT = 'CHAT',
}

export interface Request {
  appointmentId: number
}

export interface Response {
  message: string
  data: BookingResponse
}

const beginAppointment = async ({ appointmentId }: Request): Promise<BookingAttributeI> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${backendUrl}/booking/${appointmentId}/start`

  const response = await api.patch(url)
  return response.data.data
}

export const useBeginAppointment = () => {
  return useMutation({
    mutationFn: (props: Request) => beginAppointment(props),
  })
}
