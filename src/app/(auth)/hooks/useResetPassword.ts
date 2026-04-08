import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

/**
 * Reset Password Request Interface
 */
export interface ResetPasswordRequest {
  email: string
  newPassword: string
}

/**
 * Reset Password Response Interface
 */
export interface ResetPasswordResponse {
  success: boolean
  message: string
  token?: string
}

/**
 * Reset Password API Hook
 *
 * Backend Expected Payload:
 * {
 *   token: string - Password reset token from email link
 *   password: string - New password (min 8 chars, must include uppercase, number, special char)
 *   passwordConfirm: string - Password confirmation
 * }
 *
 * Backend Expected Response:
 * {
 *   success: boolean - Whether reset was successful
 *   message: string - Success or error message
 *   token?: string - New authentication token
 * }
 */
const resetPassword = async (props: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${backendUrl}/auth/reset-password`

  const response = await axios.post(url, props)

  // Store new token if provided
  if (response.data.success && response.data.token) {
    localStorage.setItem('authToken', response.data.token)
  }

  return response.data
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (props: ResetPasswordRequest) => resetPassword(props),
  })
}
