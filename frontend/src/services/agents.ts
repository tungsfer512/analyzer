import { ip } from './ip';
import { request  } from 'umi';

export async function installAgent(id: any) {
  return request(`${ip}/agents/install-agent/${id}`);
}

export async function killAgent(id: any) {
  return request(`${ip}/agents/kill-agent/${id}`);
}
