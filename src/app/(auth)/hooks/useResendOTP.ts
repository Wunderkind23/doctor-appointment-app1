import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

/**
 * Resend Token  Request Interface
 */
export interface resendOtpRequest {
  email: string
}

/**
 * Resend otp Response Interface
 */
export interface resendOtpResponse {
  message: string
}

/**
 * Resend OTP API Hook
 *
 * Backend Expected Payload:
 * {

 *   email: string - Patient's email address
\ * }
 *
 * Backend Expected Response:
 * {
 *   message: string - Success or error message
 * }
 */
const resendOtp = async (props: resendOtpRequest): Promise<resendOtpResponse> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL

  const url = `${backendUrl}/auth/resend-otp`
  const response = await axios.post(url, props)

  return response.data
}

export const useResendOtp = () => {
  return useMutation({
    mutationFn: (props: resendOtpRequest) => resendOtp(props),
  })
}
