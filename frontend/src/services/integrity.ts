import { ip } from './ip';
import {request} from 'umi';

export async function getDeviceIntegrity(device_id) {
  return request(`${ip}/integritycheck/GetItegrityCheckByDeviceId/`, { params: {
    device_id
  } });
}