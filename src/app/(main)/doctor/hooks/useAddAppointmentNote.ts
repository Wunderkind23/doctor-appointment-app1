import { useMutation } from '@tanstack/react-query'
import { BookingResponse } from '../../appointments/hooks/useFetchAppointment'
import { api } from '@/lib/api/axios'

/**
 * Book Appointment Request
 */
export interface AddNoteAttributeI {
  doctorNote: string
}

/**
 * Book Appointment Response
 */
export interface AddNoteResponse {
  message: string
  data: BookingResponse
}

const addNote = async (id: number, props: AddNoteAttributeI): Promise<AddNoteResponse> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${backendUrl}/booking/note/${id}`

  const response = await api.patch(url, props)

  return response.data
}

export const useAddAppointmentNote = (id: number) => {
  return useMutation({
    mutationFn: (props: AddNoteAttributeI) => addNote(id, props),
  })
}
