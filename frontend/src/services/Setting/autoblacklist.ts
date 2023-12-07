import axios from "@/utils/axios";
import { ip } from "@/services/ip";

export const get_auto_blacklist = () => {
  return axios.get(`${ip}/setting/autoupdateblackiplist`);
  // return { data: 3600 };
}

export const get_auto_blacklist_click = () => {
  return axios.get(`${ip}/setting/manual-update-blacklist`);
}

export const update_auto_blacklist = (time: number) => {
  return axios.put(`${ip}/setting/put-autoupdateblackiplist/${time}`);
}

export const stop_auto_blacklist = () => {
  return axios.get(`${ip}/setting/pause-autoupdateblackiplist`);
}
