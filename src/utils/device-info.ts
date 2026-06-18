import { Platform } from 'react-native';
import * as Device from 'expo-device';

export interface DeviceInfo {
  os: string;
  deviceType: string;
  deviceName: string;
}

export function getDeviceInfo(): DeviceInfo {
  const os = Platform.OS === 'web' ? 'web' : Platform.OS;

  let deviceType = 'unknown';
  let deviceName = 'Unknown Device';

  if (Platform.OS === 'web') {
    deviceType = getBrowserType();
    deviceName = `${getBrowserType()} on ${getOSName()}`;
  } else {
    deviceType = String(Device.deviceType || 'phone');
    deviceName = Device.modelName || `${getOSName()} Device`;
  }

  return {
    os,
    deviceType,
    deviceName,
  };
}

function getBrowserType(): string {
  if (typeof navigator === 'undefined') return 'unknown';

  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('firefox')) return 'firefox';
  if (ua.includes('edg')) return 'edge';
  if (ua.includes('chrome')) return 'chrome';
  if (ua.includes('safari')) return 'safari';
  return 'browser';
}

function getOSName(): string {
  if (Platform.OS === 'web') {
    if (typeof navigator === 'undefined') return 'unknown';
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('win')) return 'windows';
    if (ua.includes('mac')) return 'macos';
    if (ua.includes('linux')) return 'linux';
    if (ua.includes('android')) return 'android';
    if (ua.includes('iphone') || ua.includes('ipad')) return 'ios';
    return 'unknown';
  }
  return Platform.OS;
}
