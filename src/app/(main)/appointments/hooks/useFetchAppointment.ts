// app/(main)/appointments/hooks/useFetchAppointments.ts

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/axios'
import { BookingTypeEnum } from '../../(patient)/hooks/useBookAppointment'

interface Doctor {
  id: number
  userId: number
  isVerified: boolean
  medicalLicense: string
  specialization: string
  yearsOfExperience: number
  hospitalAffiliation: string
  professionalBio: string
  termsAccepted: boolean
  credits: number
  createdAt: string
  updatedAt: string
  user?: {
    firstName: string
    lastName: string
  }
}

interface Patient {
  id: number
  userId: number
  isStudent: boolean
  isExternal: boolean
  credits: number
  createdAt: string
  updatedAt: string
  user?: {
    firstName: string
    lastName: string
  }
}

export interface BookingResponse {
  id: number
  patientId: number
  doctorId: number
  bookingDate: string
  medicalConcern: string
  startTime: string
  endTime: string
  creditCost: number
  status: string
  doctorNote: string
  isReviewed: boolean
  createdAt: string
  updatedAt: string
  type: BookingTypeEnum
  doctor: Doctor
  patient: Patient
}

export interface AppointmentsResponse {
  result: BookingResponse[]
  totalCount: number
}

export const QUERY_KEY_FOR_APPOINTMENTS = 'appointments'

const getData = async (): Promise<AppointmentsResponse> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${backendUrl}/booking`

  const res = await api.get(url)

  return res.data?.data
}

export const useFetchAppointments = () => {
  return useQuery({
    queryKey: [QUERY_KEY_FOR_APPOINTMENTS],
    queryFn: () => getData(),
  })
}
