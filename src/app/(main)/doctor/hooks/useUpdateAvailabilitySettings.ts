import { api } from '@/lib/api/axios'
import { useMutation } from '@tanstack/react-query'

export interface DoctorAvailability {
  id: number
  doctorId: number
  dayOfWeek: number
  startTime: string
  endTime: string
  isEnabled: boolean
}

export interface DoctorSignupResponse {
  message: string
}

const updateAvailability = async (
  id: number,
  props: DoctorAvailability[],
): Promise<DoctorSignupResponse> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${backendUrl}/doctor/day-availability/${id}`

  const response = await api.put(url, props)

  return response.data
}

export const useUpdateAvailabilitySettings = (id: number) => {
  return useMutation({
    mutationFn: (props: DoctorAvailability[]) => updateAvailability(id, props),
  })
}
