/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import BaseService from '@/services/baseService';
import { ip } from '@/services/ip';
import type { IBlackListIpRecord } from '../../models/blacklistip';
import { request } from 'umi';
import axios from '@/utils/axios';

class Services extends BaseService<IBlackListIpRecord> {
  get = (payload) => {
    const { page, current, pageSize, limit } = payload;
    console.log('payload', payload);
    return request(`${ip}/BlackListIP/get_all_black_list_IP_in_device/`, {
      params: {
        current: current ?? page,
        page_size: pageSize ?? limit,
        ip: payload?.ip,
        url: payload?.url,
      },
    });
  };

  getIpInDevice = (payload) => {
    const { page, limit, id, current, pageSize } = payload;
    console.log('payload', payload);
    return request(`${ip}/BlackListIP/get_black_list_IP_in_device/`, {
      params: {
        current: page ?? current,
        id,
        page_size: limit ?? pageSize,
        ip: payload?.ip,
        url: payload?.url,
      },
    });
  };

  addBlackDevice = (payload: { id: string[]; blacklistip: string[] }) => {
    console.log('payload', payload);
    return axios.patch(`${ip}/devices/add_black_list_IP/`, payload);
  };

  del_all = async () => {
    return axios.get(`${ip}/${this.url}/clear`);
  };
}

export default new Services({ name: 'blacklistip', url: 'BlackListIP', formData: false });
