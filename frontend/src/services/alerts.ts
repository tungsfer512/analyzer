import { ip } from './ip';
import axios from 'axios';
import { request } from 'umi';

export async function getAlerts(payload: any) {
  return request(`${ip}/alerts/`, { params: payload, method: 'GET' });
}

export async function getAlertsDashboard(payload: any) {
  return request(`${ip}/alerts/search_alert/`, { params: payload, method: 'PATCH' });
}

export async function deleteAlerts(id: number) {
  return request(`${ip}/alerts/${id}/`, { method: 'DELETE' });
}

export async function exportDataExcel(payload: any) {
  return request(`${ip}/devices/export-xls/url`, { params: payload, method: 'GET' });
}

export async function exportDataPDF(payload: any) {
  return request(`${ip}/devices/export/url`, { params: payload, method: 'GET' });
}

export const deviceNormal = (device_id: any) => {
  return axios.get(`${ip}/DeviceNorm/pass_device_norm/`, { params: { device: device_id } });
}
