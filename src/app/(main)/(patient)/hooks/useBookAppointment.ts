import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

export enum BookingTypeEnum {
  CALL = 'CALL',
  VIDEO = 'VIDEO',
  CHAT = 'CHAT',
}

/**
 * Book Appointment Request
 */
export interface BookAppointmentRequest {
  doctorId: string
  patientId: string
  dateTime: string
  duration: number
  reasonForVisit: string
  medicalHistory?: string
}

/**
 * Book Appointment Response
 */
export interface BookAppointmentResponse {
  success: boolean
  message: string
  appointment?: {
    id: string
    doctorId: string
    patientId: string
    dateTime: string
    duration: number
    status: 'scheduled'
    createdAt: string
    type: BookingTypeEnum
  }
}

/**
 * Book Appointment API Hook
 *
 * Backend Expected Payload:
 * {
 *   doctorId: string - Doctor's ID
 *   patientId: string - Patient's ID
 *   dateTime: string - ISO format appointment time
 *   duration: number - Appointment duration in minutes
 *   reasonForVisit: string - Chief complaint/reason
 *   medicalHistory?: string - Relevant medical history
 * }
 *
 * Backend Expected Response:
 * {
 *   success: boolean - Whether booking was successful
 *   message: string - Success or error message
 *   appointment?: {...} - Booked appointment details
 * }
 */
const bookAppointment = async (props: BookAppointmentRequest): Promise<BookAppointmentResponse> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${backendUrl}/v1/appointments/book`

  const response = await axios.post(url, props, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
  })
  return response.data
}

export const useBookAppointment = () => {
  return useMutation({
    mutationFn: (props: BookAppointmentRequest) => bookAppointment(props),
  })
}
