/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import BaseService from '@/services/baseService';
import { ip } from '@/services/ip';
import type { IMenuRecord } from '../../models/menus';
import axios from '@/utils/axios';
import { request } from 'umi';

class Services extends BaseService<IMenuRecord> {
  upd = (payload) => {
    const { name, code, code_parent, id } = payload;
    return axios.put(`${ip}/menus/${id}`, {name, code, code_parent});
  }
  add = (payload) => {
    const { name, code, code_parent } = payload;
    return axios.post(`${ip}/menus`, {name, code, code_parent});
  }
  del = (payload) => {
    return axios.delete(`${ip}/menus/${payload}`);
  }
  
}

export default new Services({ name: 'menus', url: 'menus', formData: false });