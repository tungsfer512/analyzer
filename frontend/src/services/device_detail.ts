import axios from '@/utils/axios';
import { request } from 'umi';
import { ip } from './ip';

export async function getDeviceIntegrity(device_id) {
  return request(`${ip}/integritycheck/GetItegrityCheckByDeviceId/`, {
    params: {
      device_id
    }
  });
}

export async function killProcessService(payload) {
  return request(`${ip}/alerts/kill_process/`, { params: payload });
}

export async function rebootDeviceService(payload) {
  return request(`${ip}/devices/reboot/`, { params: payload });
}


export async function getDeviceAlert(payload) {
  return request(`${ip}/alerts/GetAlertsByIP/`, { params: payload });
}

export async function getDeviceAlertById(payload) {
  return request(`${ip}/alerts/`, { params: payload });
}

export async function getDevice(device_id: string, searchKey: any, filter: any) {

  let paramsss = {}
  paramsss = {
    ...paramsss,
    device_id
  }
  if ((searchKey !== undefined && searchKey !== "" && searchKey !== null)) {
    paramsss = {
      ...paramsss,
      searchKey
    }
  }
  if ((filter !== undefined && filter !== null)) {
    paramsss = {
      ...paramsss,
      filter
    }
  }

  return request(`${ip}/processlist/GetProcessListByDeviceId/`, {
    params: paramsss
  });
}

export async function getSyscallList(device_id: string) {
  return request(`${ip}/syscalllist/GetSyscallListByDeviceID/`, {
    params: {
      device_id
    }
  });
}

export async function startTracing(payload) {
  return request(`${ip}/syscalllist/TraceSyscall/`, { params: payload });
}

export async function stopTracing(payload) {
  return request(`${ip}/syscalllist/StopTraceSyscall/`, { params: payload });
}


export async function startTracingNetwork(payload) {
  return request(`${ip}/syscalllist/TraceNetwork/`, { params: payload, skipErrorHandler: true },);
}

export async function stopTracingNetwork(payload) {
  return request(`${ip}/syscalllist/StopTraceNetwork/`, { params: payload });
}

