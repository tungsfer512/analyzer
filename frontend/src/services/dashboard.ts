import { request } from 'umi';
import { ip } from './ip';
import axios from '../utils/axios';

export async function getDashboard(payload: any) {
  return request(`${ip}/dashboard/stat/`, {
    params: payload,
  });
}
export async function startTracePcap(payload: any) {
  return request(`${ip}/dashboard/startTracePcap/`, {
    params: payload,
  });
}
export async function stopTracePcap(payload: any) {
  return request(`${ip}/dashboard/stopTracePcap/`, {
    params: payload,
  });
}

export async function send_performance_to_elastic() {
  return axios.get(`${ip}/dashboard/send_performance_to_elastic/`);
}

