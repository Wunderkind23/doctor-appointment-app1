import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

/**
 * Search Doctor Request
 */
export interface SearchDoctorsRequest {
  specialty?: string
  location?: string
  minRating?: number
  isAvailable?: boolean
  limit?: number
  offset?: number
}

/**
 * Doctor Profile for Search
 */
export interface DoctorProfile {
  id: string
  name: string
  email: string
  specialty: string
  rating: number
  reviewCount: number
  yearsOfExperience: number
  hospitalAffiliation: string
  isAvailable: boolean
  consultationFee: number
  avatar?: string
  bio: string
}

/**
 * Search Doctors Response
 */
export interface SearchDoctorsResponse {
  success: boolean
  doctors: DoctorProfile[]
  total: number
}

/**
 * Search Doctors API Hook
 *
 * Backend Expected Endpoint: GET /v1/doctors/search
 *
 * Query Parameters:
 * {
 *   specialty?: string - Medical specialization
 *   location?: string - Doctor's location
 *   minRating?: number - Minimum rating (0-5)
 *   isAvailable?: boolean - Filter by availability
 *   limit?: number - Max results
 *   offset?: number - Pagination offset
 * }
 *
 * Backend Expected Response:
 * {
 *   success: boolean - Request success
 *   doctors: DoctorProfile[] - List of doctors
 *   total: number - Total count of matching doctors
 * }
 */
const searchDoctors = async (params: SearchDoctorsRequest): Promise<SearchDoctorsResponse> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${backendUrl}/v1/doctors/search`

  const response = await axios.get(url, {
    params,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
  })
  return response.data
}

export const useSearchDoctors = (params: SearchDoctorsRequest, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['searchDoctors', params],
    queryFn: () => searchDoctors(params),
    enabled,
  })
}
