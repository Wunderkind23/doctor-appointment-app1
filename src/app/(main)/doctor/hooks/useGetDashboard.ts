import { api } from '@/lib/api/axios'
import { useQuery } from '@tanstack/react-query'

export interface DashboardAttributeI {
  completedAppointment: number
  totalEarnings: number
  totalPayouts: number
  availableBalance: number
}

export const QUERY_KEY_FOR_DOC_FETCH = 'docDashboard'

const getData = async (id: number): Promise<DashboardAttributeI> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL

  const url = `${backendUrl}/doctor/${id}/dashboard`
  const res = await api.get(url)
  console.log(res.data?.data)
  return res.data?.data
}

export const useFetchDocDashboard = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEY_FOR_DOC_FETCH, id],
    queryFn: () => getData(id),
    enabled: !!id,
  })
}
