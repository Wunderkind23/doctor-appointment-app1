import { AxiosError } from 'axios'
import { toast } from 'sonner'

interface BackendErrorResponse {
  message?: string
  error?: string
  errors?: Record<string, string[]> | string[]
  statusCode?: number
}

interface ErrorHandlerOptions {
  showToast?: boolean
  customMessages?: Record<number, string>
  fallbackMessage?: string
}

export class ApiError extends Error {
  statusCode: number
  errors?: Record<string, string[]> | string[]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, statusCode: number, errors?: any) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.errors = errors
  }
}

/**
 * Extract error message from Axios error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as BackendErrorResponse
    const status = error.response?.status

    // Network errors
    if (!error.response) {
      return 'Network error. Please check your connection.'
    }

    // Status-specific handling
    switch (status) {
      case 400:
        // Bad request - show backend message if available
        return data?.message || data?.error || 'Invalid request. Please check your input.'

      case 401:
        return data?.message || 'Please log in to continue.'

      case 403:
        return 'You do not have permission to perform this action.'

      case 404:
        return data?.message || 'The requested resource was not found.'

      case 409:
        // Conflict - usually specific backend message
        return (
          data?.message ||
          data?.error ||
          'This resource already exists or conflicts with existing data.'
        )

      case 422:
        // Validation error - extract validation messages
        if (data?.errors) {
          return extractValidationErrors(data.errors)
        }
        return data?.message || 'Validation failed. Please check your input.'

      case 429:
        return 'Too many requests. Please try again later.'

      case 500:
      case 502:
      case 503:
      case 504:
        // Server errors - generic message
        return 'Something went wrong on our end. Please try again later.'

      default:
        return data?.message || data?.error || 'An unexpected error occurred.'
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred.'
}

/**
 * Extract validation errors into a readable string
 */
function extractValidationErrors(errors: Record<string, string[]> | string[]): string {
  if (Array.isArray(errors)) {
    return errors.join(', ')
  }

  const messages = Object.entries(errors)
    .map(([field, messages]) => {
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1)
      return `${fieldName}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
    })
    .join('; ')

  return messages || 'Validation failed'
}

/**
 * Handle error and optionally show toast
 */
export function handleApiError(error: unknown, options: ErrorHandlerOptions = {}): string {
  const { showToast = true, customMessages = {}, fallbackMessage } = options

  let message: string

  if (error instanceof AxiosError) {
    const status = error.response?.status

    // Check for custom message for this status code
    if (status && customMessages[status]) {
      message = customMessages[status]
    } else {
      message = getErrorMessage(error)
    }
  } else {
    message = fallbackMessage || getErrorMessage(error)
  }

  if (showToast) {
    toast.error(message)
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', error)
  }

  return message
}

/**
 * Get detailed error info for debugging
 */
export function getErrorDetails(error: unknown): ApiError | null {
  if (error instanceof AxiosError) {
    const data = error.response?.data as BackendErrorResponse
    const status = error.response?.status || 500

    return new ApiError(getErrorMessage(error), status, data?.errors)
  }

  return null
}

/**
 * Check if error is a specific status code
 */
export function isErrorStatus(error: unknown, status: number): boolean {
  return error instanceof AxiosError && error.response?.status === status
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: unknown): boolean {
  return isErrorStatus(error, 422) || isErrorStatus(error, 400)
}

/**
 * Get validation errors as an object
 */
export function getValidationErrors(error: unknown): Record<string, string[]> | null {
  if (error instanceof AxiosError) {
    const data = error.response?.data as BackendErrorResponse

    if (data?.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
      return data.errors
    }
  }

  return null
}
