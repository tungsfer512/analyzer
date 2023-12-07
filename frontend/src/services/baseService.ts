/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import axios from '@/utils/axios';
import { ip } from './ip';

import { isValue, trim } from '../utils/utils';
import { IPayload } from '@/models/baseModel';

class Services<T> {
  name: string;

  formData: boolean;

  url: string;

  constructor({ name, formData, url }: { name: string; formData: boolean; url: string }) {
    this.name = name;
    this.formData = formData;
    this.url = url || name;
  }

  del = async (id: string) => {
    return axios.delete(`${ip}/${this.url}/${id}`);
  };

  get = async (payload: IPayload) => {
    // console.log(payload);
    return axios.get(`${ip}/${this.url}`, { params: payload });
  };

  add = async (payload: T) => {
    if (this.formData) {
      const form = new FormData();
      Object.keys(payload).forEach((key) => {
        if (isValue(payload[key])) {
          if (Array.isArray(payload[key])) {
            for (let i = 0; i < payload[key].length; i += 1) {
              form.append(key, payload[key][i]);
            }
            return;
          }
          form.set(key, trim(payload[key]));
        }
      });
      return axios.post(`${ip}/${this.url}/`, form);
    }
    Object.keys(payload).forEach((key) => {
      // if (isValue(payload[key])) payload[key] = trim(payload[key]);
      payload[key] = trim(payload[key]);
    });
    return axios.post(`${ip}/${this.url}`, payload);
  };

  add2 = async (payload: T) => {
    if (this.formData) {
      const form = new FormData();
      Object.keys(payload).forEach((key) => {
        if (isValue(payload[key])) {
          if (Array.isArray(payload[key])) {
            for (let i = 0; i < payload[key].length; i += 1) {
              form.append(key, payload[key][i]);
            }
            return;
          }
          form.set(key, trim(payload[key]));
        }
      });
      return axios.post(`${ip}/${this.url}/`, form);
    }
    Object.keys(payload).forEach((key) => {
      // if (isValue(payload[key])) payload[key] = trim(payload[key]);
      payload[key] = trim(payload[key]);
    });
    return axios.post(`${ip}/${this.url}/`, payload);
  };

  upd = async (payload: T & { id: string | undefined }) => {
    if (this.formData) {
      const form = new FormData();
      const { id } = payload;
      payload.id = undefined;
      Object.keys(payload).map((key) => {
        if (isValue(payload[key])) {
          if (Array.isArray(payload[key])) {
            for (let i = 0; i < payload[key].length; i += 1) {
              form.append(key, payload[key][i]);
            }
            return;
          }
          form.set(key, trim(payload[key]));
        }
      });
      return axios.put(`${ip}/${this.url}/${id}/`, form);
    }
    const { id } = payload;
    payload.id = undefined;
    Object.keys(payload).forEach((key) => {
      if (isValue(payload[key])) payload[key] = trim(payload[key]);
    });
    return axios.put(`${ip}/${this.url}/${id}`, payload);
  };
}

export async function uploadFile(file: any) {
  const form = new FormData();
  form.append('uploadAnh', file);
  return axios.post(`${ip}/upload-anh/`, form);
}

export async function uploadImage(file: any, fileName = ' ', mode = false) {
  if (!mode) {
    const form = new FormData();
    form.append('file', file);
    form.append('filename', fileName);
    form.append('public', true);
    return axios.post(`${ip}/file/image/single`, form);
  }
  const form = new FormData();
  file?.map((item) => {
    form.append('file', item);
  });
  form.append('filename', fileName);
  form.append('public', true);
  return axios.post(`${ip}/file/image/multiple`, form);
}

export default Services;
