import { useQuery } from '@tanstack/react-query';
import { alertsApi } from '@/api/alerts';

export function useAlerts() {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: alertsApi.getAlerts,
  });
}
