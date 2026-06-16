import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { devicesApi } from '@/api/devices';
import { getDeviceId } from '@/utils/secure-storage';
import { getDeviceInfo } from '@/utils/device-info';

export function useDeviceRegistry() {
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const registerDevice = async () => {
      try {
        const deviceId = await getDeviceId();
        const deviceInfo = getDeviceInfo();

        await devicesApi.register({
          device_id: deviceId,
          name: deviceInfo.deviceName,
          os_type: deviceInfo.os,
          device_type: deviceInfo.deviceType,
        });

        // Heartbeat every 30s
        intervalId = setInterval(async () => {
          try {
            await devicesApi.heartbeat(deviceId);
          } catch (err) {
            console.error('Heartbeat failed:', err);
          }
        }, 30000);
      } catch (err) {
        console.error('Device registration failed:', err);
      }
    };

    registerDevice();

    return () => {
      if (intervalId !== null) clearInterval(intervalId);
    };
  }, []);
}

export function useConnectedDevices() {
  return useQuery({
    queryKey: ['devices'],
    queryFn: () => devicesApi.list(),
    refetchInterval: 30000,
  });
}
