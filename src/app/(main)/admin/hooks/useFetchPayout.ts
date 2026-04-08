// app/(main)/doctor/hooks/useFetchSingleDoc.ts

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/axios'
import { SingleDocAttributeI } from './useFetchDocs'

export enum PayoutStatusEnum {
  PAID = 'PAID',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

export interface SinglePayoutAttributeI {
  id: number
  doctorId: number
  amount: number
  accountName: string
  bankName: string
  accountNumber: string
  status: PayoutStatusEnum
  doctor: SingleDocAttributeI
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  result: T[]
  totalCount: number
}

export const QUERY_KEY_FOR_PAYOUT_FETCH = 'payouts'

const getData = async (type?: string): Promise<PaginatedResponse<SinglePayoutAttributeI>> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${backendUrl}/payout?type${type}`
  const res = await api.get(url)
  return res.data.data
}

export const useFetchPayouts = (type?: string) => {
  return useQuery({
    queryKey: [QUERY_KEY_FOR_PAYOUT_FETCH],
    queryFn: () => getData(type),
  })
}
