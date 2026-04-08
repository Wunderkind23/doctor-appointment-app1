// app/(main)/doctor/hooks/useFetchSingleDoc.ts

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/axios'

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

export interface SinglePatientAttributeI {
  id: number
  userId: number
  isStudent: boolean
  isExternal: boolean
  credits: number
  user: User
}

export interface PaginatedResponse<T> {
  result: T[]
  totalCount: number
}

export const QUERY_KEY_FOR_PATIENTS_FETCH = 'patients'

const getData = async (
  search: string,
  type?: string,
): Promise<PaginatedResponse<SinglePatientAttributeI>> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${backendUrl}/patient?type=${type}&search=${search}`

  const res = await api.get(url)
  return res.data.data
}

export const useFetchPatient = (search: string, type?: string) => {
  return useQuery({
    queryKey: [QUERY_KEY_FOR_PATIENTS_FETCH, search, type],
    queryFn: () => getData(search, type),
  })
}
