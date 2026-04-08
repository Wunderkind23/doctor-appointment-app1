import { api } from '@/lib/api/axios'
import { useMutation } from '@tanstack/react-query'

interface request {
  patientId: number
  matricNumber: string
  department: string
  faculty: string
  level: string
}

export interface Response {
  message: string
}

const makeStudent = async (data: request): Promise<Response> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL

  const url = `${backendUrl}/student`

  const response = await api.post(url, data)
  return response.data
}

export const useMakeStudent = () => {
  return useMutation({
    mutationFn: (data: request) => makeStudent(data),
  })
}
