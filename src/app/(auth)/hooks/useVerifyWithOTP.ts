import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

/**
 * Verify Token  Request Interface
 */
export interface otpVerifyRequest {
  email: string
  otp: string
}

/**
 * Verify Token Response Interface
 */
export interface otpVerifyResponse {
  message: string
  data?: object
  accessToken?: string
}

/**
 * Verify OTP API Hook
 *
 * Backend Expected Payload:
 * {

 *   email: string - Patient's email address
 *   otp: string - Password (min 6 chars)
 * }
 *
 * Backend Expected Response:
 * {
 *   message: string - Success or error message
 *   token?: string - JWT authentication token (if auto-login)
 *   data?: {...} - User data if auto-login
 * }
 */
const veryOtp = async (props: otpVerifyRequest): Promise<otpVerifyResponse> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL

  const url = `${backendUrl}/auth/verify-otp`
  const response = await axios.post(url, props)

  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken)
  }

  if (response.data.data) {
    localStorage.setItem('userData', JSON.stringify(response.data.data))
  }

  return response.data
}

export const useVerifyToken = () => {
  return useMutation({
    mutationFn: (props: otpVerifyRequest) => veryOtp(props),
  })
}
