import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { DoctorAvailability } from './useUpdateAvailabilitySettings';

export const QUERY_KEY_FOR_AVAILABILITY = 'dayAvailability';

const getData = async (id: number): Promise<DoctorAvailability[]> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${backendUrl}/doctor/day-availability/${id}`;

  const res = await api.get(url);

  return res.data?.data;
};

export const useFetchAvailabilitySettings = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEY_FOR_AVAILABILITY, id],
    queryFn: () => getData(id),
    enabled: !!id,
  });
};
