// app/(main)/appointments/types.ts or wherever you keep types

import { BookingTypeEnum } from '@/app/(main)/(patient)/hooks/useBookAppointment'
import { AppointmentStatusEnum } from '@/app/(main)/doctors/hooks/userCreateBooking'

export interface Appointment {
  id: number
  dateTime: string // This will be the booking date
  status: AppointmentStatusEnum
  doctorName: string
  patientName: string
  specialty: string
  notes: string | null
  startTime: string
  endTime: string
  doctorsNote: string
  type: BookingTypeEnum
  patientId: number
  doctorId: number
  isReviewed: boolean
}
