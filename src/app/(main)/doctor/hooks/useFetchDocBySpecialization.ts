import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/axios'
import { GenderEnum, SpecialtyEnum, UserRoleEnum, VerificationStatusEnum } from '@/app/(auth)/types'

export interface DoctorsWithRatingAttributeI {
  rating: number
  id: number
  userId: number
  medicalLicense: string
  specialization: SpecialtyEnum
  yearsOfExperience: number
  hospitalAffiliation: string
  professionalBio: string
  termsAccepted: boolean
  isVerified: boolean
  credits: number
  user?: {
    id: number
    firstName: string
    lastName: string
    password: string
    phoneNumber: string
    email: string
    imageUrl?: string
    gender: GenderEnum
    role: UserRoleEnum
    credits: number
    verificationStatus: VerificationStatusEnum
    isActive: boolean
    dob: Date
  }
}

export const QUERY_KEY_FOR_DOC_SPECIALIZATION_FETCH = 'docBySpecialization'

const getData = async (type: string): Promise<DoctorsWithRatingAttributeI[]> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${backendUrl}/doctor/specialization?type=${type}`

  const res = await api.get(url)
  return res.data?.data
}

export const useFetchDocBySpecialization = (type: string) => {
  return useQuery({
    queryKey: [QUERY_KEY_FOR_DOC_SPECIALIZATION_FETCH, type],
    queryFn: () => getData(type),
    enabled: !!type,
  })
}
