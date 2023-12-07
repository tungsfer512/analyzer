import axios from '@/utils/axios';
import { request } from 'umi';
import { ip } from './ip';

export async function getDevices(payload: any) {
  return request(`${ip}/devices/`, { params: payload, method: 'GET' });
}

export async function addIPToDevices(payload, flag) {
  return axios.patch(`${ip}${flag !== 'black' ? '/devices/add_white_list_IP/' : '/devices/add_black_list_IP/'}`, payload);
}

export async function removeIPFromDevices(payload, flag) {
  console.log('payload', payload)
  console.log('flag', flag)
  const { blacklistip, whitelistip } = payload;
  return axios.delete(`${ip}${flag !== 'black' ? `/WhiteListIP/${whitelistip}/` : `/BlackListIP/${blacklistip}/`}`);
}

export async function installListAgent(payload) {
  return request(`${ip}/devices/install_list_agent/`, { method: 'PATCH', data: payload });
}

export async function unInstallListAgent(payload) {
  return request(`${ip}/devices/kill_list_agent/`, { method: 'PATCH', data: payload });
}


export async function reloaDeviceById(id: string) {
  return request(`${ip}/devices/reboot/`, { params: { id } });
}

export async function isolateDeviceById(id: string) {
  return request(`${ip}/devices/isolate/`, { params: { id } });
}

export async function getDevicesById(id: string) {
  return request(`${ip}/devices/${id}/`);
}

export async function getDataTrackIp(payload: any) {
  return request(`${ip}/IpsTracking/list_ip_tracking/`, { method: 'GET', params: payload });
}

export async function createDevices(payload: any) {
  return request(`${ip}/devices/`, { data: payload, method: 'POST' });
}

export async function editDevice(id: any, payload: any) {
  return request(`${ip}/devices/${id}/`, { method: 'PATCH', data: payload });
}
export async function editGioiHanDevice(id: any, payload: any) {
  console.log(payload)
  return request(`${ip}/DeviceNorm/update_by_device_id/`, { method: 'PATCH', data: { ...payload, device: id } , params: { device_id: id } });
}
export async function getGioiHanDevice(id: any) {
  return request(`${ip}/DeviceNorm/get_by_device_id/`, { method: 'GET', params: { device_id: id } });
}
export async function deleteDevice(id: any) {
  return request(`${ip}/devices/${id}/`, { method: 'DELETE' });
}

export async function installDevice(id: any) {
  return request(`${ip}/devices/${id}/`, { data: { agentInstalled: true }, method: 'PATCH' });
}

export async function uninstallDevice(id: any) {
  return request(`${ip}/devices/${id}/`, { data: { agentInstalled: false }, method: 'PATCH' });
}
