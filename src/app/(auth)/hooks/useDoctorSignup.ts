import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

/**
 * Doctor Signup Request Interface
 */
export interface DoctorSignupRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: string
  medicalLicense: string
  specialization: string
  yearsOfExperience: number
  hospitalAffiliation: string
  professionalBio: string
}

/**
 * Doctor Signup Response Interface
 */
export interface DoctorSignupResponse {
  message: string
}

/**
 * Doctor Signup API Hook
 *
 * Backend Expected Payload:
 * {
 *   firstName: string - Doctor's first name
 *   lastName: string - Doctor's last name
 *   email: string - Doctor's email address
 *   password: string - Password (min 8 chars, must include uppercase, number, special char)
 *   passwordConfirm: string - Password confirmation
 *   phoneNumber: string - Doctor's contact number
 *   medicalLicense: string - Medical license number
 *   specialization: string - Medical specialization
 *   yearsOfExperience: number - Years of medical practice
 *   hospitalAffiliation: string - Current hospital/clinic affiliation
 *   professionalBio: string - Professional biography
 * }
 *
 * Backend Expected Response:
 * {
 *   message: string - Success or error message
 *   token?: string - JWT authentication token (if auto-login)
 *   user?: {...} - User data if auto-login
 * }
 */
const signupDoctor = async (props: DoctorSignupRequest): Promise<DoctorSignupResponse> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${backendUrl}/auth/signup`

  const response = await axios.post(url, props)

  return response.data
}

export const useDoctorSignup = () => {
  return useMutation({
    mutationFn: (props: DoctorSignupRequest) => signupDoctor(props),
  })
}
