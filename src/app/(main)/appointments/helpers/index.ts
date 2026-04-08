// app/(main)/appointments/utils/transformAppointment.ts

import { Appointment } from '@/types/appointment'
import { BookingResponse } from '../hooks/useFetchAppointment'
import { AppointmentStatusEnum } from '../../doctors/hooks/userCreateBooking'

export const transformAppointmentData = (booking: BookingResponse): Appointment => {
  // Get doctor name from user data or fallback
  const doctorName = booking.doctor.user
    ? `${booking.doctor.user.firstName} ${booking.doctor.user.lastName}`
    : 'Unknown Doctor'

  // Get patient name from user data or fallback
  const patientName = booking.patient.user
    ? `${booking.patient.user.firstName} ${booking.patient.user.lastName}`
    : 'Unknown Patient'

  // Format specialty (remove dashes and capitalize)
  const specialty = booking.doctor.specialization
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return {
    id: booking.id,
    dateTime: booking.bookingDate,
    status: booking.status as AppointmentStatusEnum,
    doctorName,
    patientName,
    specialty,
    notes: booking.medicalConcern || '',
    startTime: booking.startTime,
    endTime: booking.endTime,
    doctorsNote: booking.doctorNote || '',
    type: booking.type,
    patientId: booking.patientId,
    doctorId: booking.doctorId,
    isReviewed: booking.isReviewed,
  }
}
