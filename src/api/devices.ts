import { apiClient } from './client';

interface RegisterDeviceInput {
  device_id: string;
  name: string;
  os_type: string;
  device_type: string;
}

export interface Device {
  id: string;
  device_id: string;
  name: string;
  os_type: string;
  device_type: string;
  last_seen: string;
  online: boolean;
  created_at: string;
}

export const devicesApi = {
  register: (data: RegisterDeviceInput) =>
    apiClient.post<Device>('/devices/register', data).then((r) => r.data),

  list: () =>
    apiClient.get<Device[]>('/devices').then((r) => r.data),

  heartbeat: (deviceId: string) =>
    apiClient.post<Device>(`/devices/${deviceId}/heartbeat`).then((r) => r.data),

  delete: (deviceId: string) =>
    apiClient.delete(`/devices/${deviceId}`).then((r) => r.data),
};
