import axios from "@/utils/axios";
import { ip } from "@/services/ip";

export const get_auto_password = () => {
  return axios.get(`${ip}/setting/autochangepw`);
  // return { data: 3600 };
}

export const get_auto_password_click = () => {
  return axios.get(`${ip}/setting/manual-update-password`);
}

export const update_auto_password = (time: number) => {
  return axios.put(`${ip}/setting/put-autochangepw/${time}`);
}

export const stop_auto_password = () => {
  return axios.get(`${ip}/setting/pause-autochangepw`);
}
