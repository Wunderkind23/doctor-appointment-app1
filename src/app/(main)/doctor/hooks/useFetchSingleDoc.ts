// app/(main)/doctor/hooks/useFetchSingleDoc.ts

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/axios'

export interface TimeSlot {
  startTime: string
  endTime: string
  formatted: string
}

export interface DayAvailability {
  date: string
  displayDate: string
  dayOfWeek: number
  slots: TimeSlot[]
}

export interface DayAvailabilitySetting {
  id: number
  doctorId: number
  dayOfWeek: number
  startTime: string | null
  endTime: string | null
  isEnabled: boolean
  createdAt: string
  updatedAt: string
}

export interface User {
  id: number
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  imageUrl: string | null
  role: string
  gender: string
  credits: number
  verificationStatus: string
  isActive: boolean
  dob: string
  createdAt: string
  updatedAt: string
}

export interface SingleDocAttributeI {
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
  rating: number
  createdAt: string
  updatedAt: string
  user: User
  dayAvailabilities: DayAvailabilitySetting[]
  availability: DayAvailability[]
}

export const QUERY_KEY_FOR_DOC_FETCH = 'doc'

const getData = async (id: string): Promise<SingleDocAttributeI> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${backendUrl}/doctor/${id}`

  const res = await api.get(url)
  console.log(res.data?.data)
  return res.data?.data
}

export const useFetchSingleDoc = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY_FOR_DOC_FETCH, id],
    queryFn: () => getData(id),
    enabled: !!id,
  })
}
