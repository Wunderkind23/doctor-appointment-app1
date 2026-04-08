import { api } from '@/lib/api/axios'
import { useMutation } from '@tanstack/react-query'

export interface CreateBookingRequest {
  doctorId: number
  bookingDate: Date
  medicalConcern: string
  startTime: string
  endTime: string
  type: string
}

export enum AppointmentStatusEnum {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  IN_PROGRESS = 'IN_PROGRESS',
}

export interface BookingAttributeI {
  id: number
  patientId: number
  doctorId: number
  bookingDate: Date
  medicalConcern: string
  startTime: string
  endTime: string
  creditCost: number
  doctorNote: string
  status: AppointmentStatusEnum
}

export interface BookingResponse {
  message: string
  data: {
    id: number
    patientId: number
    doctorId: number
    bookingDate: Date
    medicalConcern: string
    startTime: string
    endTime: string
    creditCost: number
    doctorNote: string
    status: AppointmentStatusEnum
  }
}

const createBooking = async (props: CreateBookingRequest): Promise<BookingResponse> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL

  const url = `${backendUrl}/booking`

  const response = await api.post(url, props)

  return response.data
}

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: (props: CreateBookingRequest) => createBooking(props),
  })
}
