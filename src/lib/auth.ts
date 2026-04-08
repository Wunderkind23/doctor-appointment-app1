// Authentication service
// This handles user authentication and session management

import { AuthUser } from '@/app/_interfaces/auth.interface'

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const stored = localStorage.getItem('userData')
    const token = localStorage.getItem('accessToken')

    if (!stored || !token) {
      return null
    }

    const user = JSON.parse(stored)
    return user
  } catch {
    return null
  }
}

export function logout(): void {
  if (typeof window === 'undefined') {
    return
  }

  // Clear localStorage
  localStorage.removeItem('userData')
  localStorage.removeItem('accessToken')
  localStorage.removeItem('rememberMe')

  // Clear cookies (using consistent key names)
  document.cookie = 'accessToken=; path=/; max-age=0'
  document.cookie = 'userData=; path=/; max-age=0'

  // Emit event to update UI
  window.dispatchEvent(new Event('auth-changed'))
}

export async function initializeAuth(user: AuthUser, token?: string): Promise<void> {
  if (typeof window === 'undefined') {
    return
  }

  // Store in localStorage
  localStorage.setItem('userData', JSON.stringify(user))

  if (token) {
    localStorage.setItem('accessToken', token)

    // Store in cookies for middleware (using consistent key names)
    const maxAge = 60 * 60 * 24 * 7 // 7 days

    document.cookie = `accessToken=${token}; path=/; max-age=${maxAge}`
    document.cookie = `userData=${encodeURIComponent(
      JSON.stringify(user),
    )}; path=/; max-age=${maxAge}`
  } else {
  }

  // Emit event to update UI
  window.dispatchEvent(new Event('auth-changed'))
}

export async function initializeData(): Promise<void> {
  // Initialize any global app data
  return Promise.resolve()
}

// Helper function to check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const token = localStorage.getItem('accessToken')
  return !!token
}

// Helper function to get auth token
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  return localStorage.getItem('accessToken')
}

// Helper function to check if user has specific role
export function hasRole(role: AuthUser['role']): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    const stored = localStorage.getItem('userData')
    if (!stored) return false

    const user: AuthUser = JSON.parse(stored)
    return user.role === role
  } catch {
    return false
  }
}
