import { AuthUser } from '@/app/_interfaces/auth.interface'
import { initializeAuth } from '@/lib/auth'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

/**
 * Login Request Interface
 * Expects user email and password for authentication
 */
export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

/**
 * Login Response Interface
 * Returns user data and authentication token
 */
export interface LoginResponse {
  message: string
  data?: {
    accessToken: string
    user: AuthUser
  }
}

/**
 * Login API Hook
 *
 * Backend Expected Payload:
 * {
 *   email: string - User's email address
 *   password: string - User's password
 *   rememberMe?: boolean - Optional: keep user logged in
 * }
 *
 * Backend Expected Response:
 * {
 *   success: boolean - Whether login was successful
 *   token: string - JWT authentication token
 *   user: {
 *     id: string - User ID
 *     name: string - User's full name
 *     email: string - User's email
 *     role: 'ADMIN' | 'DOCTOR' | 'PATIENT' - User role
 *     credits: number - User's credits (for patients)
 *   }
 * }
 */
const loginUser = async (props: LoginRequest): Promise<LoginResponse> => {
  const { rememberMe, ...others } = props
  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${backendUrl}/auth/login`

  const response = await axios.post(url, others)

  // Store token if login successful
  if (response.data?.data?.accessToken) {
    await initializeAuth(response.data.data.user, response.data.data.accessToken)

    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true')
    }
  } else {
    console.log('No access token in response')
  }

  return response.data
}

export const useLogin = () => {
  return useMutation({
    mutationFn: (props: LoginRequest) => loginUser(props),
  })
}
