import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

/**
 * Forgot Password Request Interface
 */
export interface ForgotPasswordRequest {
  email: string
}

/**
 * Forgot Password Response Interface
 */
export interface ForgotPasswordResponse {
  success: boolean
  message: string
}

/**
 * Forgot Password API Hook
 *
 * Backend Expected Payload:
 * {
 *   email: string - User's email address
 * }
 *
 * Backend Expected Response:
 * {
 *   success: boolean - Whether request was successful
 *   message: string - Confirmation message
 * }
 */
const forgotPassword = async (props: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${backendUrl}/auth/forgot-password`

  const response = await axios.post(url, props)
  return response.data
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (props: ForgotPasswordRequest) => forgotPassword(props),
  })
}
