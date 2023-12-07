/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import BaseService from '@/services/baseService';
import { ip } from '@/services/ip';
import type { IWhiteListIpRecord } from '../../models/whitelistip';
import { request } from 'umi';
import axios from '@/utils/axios';
class Services extends BaseService<IWhiteListIpRecord> {
  get = (payload) => {
    const { page, current, pageSize, limit } = payload;
    return request(`${ip}/WhiteListIP/get_all_white_list_IP_in_device/`, {
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
    return request(`${ip}/WhiteListIP/get_white_list_IP_in_device/`, {
      params: {
        current: page ?? current,
        id,
        page_size: limit ?? pageSize,
        ip: payload?.ip,
        url: payload?.url,
      },
    });
  };

  addWhiteDevice = (payload: { id: string[]; whitelistip: string[] }) => {
    return axios.patch(`${ip}/devices/add_white_list_IP/`, payload);
  };

  del_all = async () => {
    return axios.get(`${ip}/${this.url}/clear`);
  };
}

export default new Services({ name: 'whitelistip', url: 'WhiteListIP', formData: false });
