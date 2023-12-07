import { ip } from './ip';
import axios from 'axios';

export async function uploadFile(payload: { file: string | Blob; filename: string; public: any }) {
  const form = new FormData();
  form.append('file', payload?.file);
  form.append('filename', payload?.filename);
  form.append('public', payload?.public);
  return axios.post(`${ip}/file/data/single`, form);
}

export async function upload_pcap(payload: { formData: FormData }) {
  const formData = payload?.formData;
  console.log(formData);
  return axios.post(`${ip}/file/get_file_from_pcap`, formData);
}

export async function auto_extract(payload: any) {
  return axios.post(`${ip}/file/get_file_from_network_with_time`, payload);
}

export async function get_devices() {
  // return {
  //   "data": [{ "id": 1, "name": "device 1" }, { "id": 2, "name": "device 2" }, { "id": 3, "name": "device 3" }, { "id": 4, "name": "device 4" },]
  // }
  return axios.get(`${ip}/devices/`);
}

export const download_all_file = async () => {
  return axios.get(`${ip}/snorts`).then(res => {
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', 'snort.rules');
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
}
