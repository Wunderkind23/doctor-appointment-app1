// hooks/useCredits.ts
import { api } from '@/lib/api/axios'
import { useQuery } from '@tanstack/react-query'

export const useCredits = () => {
  return useQuery({
    queryKey: ['credits'],
    // refetchInterval: 10000,
    queryFn: async () => {
      const { data } = await api.get('/finance/credits')
      return data?.data.credits as number
    },
    staleTime: 0,
  })
}
