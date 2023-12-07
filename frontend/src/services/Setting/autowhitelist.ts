import axios from "@/utils/axios";
import { ip } from "@/services/ip";

export const get_auto_whitelist = () => {
  return axios.get(`${ip}/setting/autoupdatewhiteiplist`);
  // return { data: 3600 };
}

export const get_auto_whitelist_click = () => {
  return axios.get(`${ip}/setting/manual-update-whitelist`);
}

export const update_auto_whitelist = (time: number) => {
  return axios.put(`${ip}/setting/put-autoupdatewhiteiplist/${time}`);
}

export const stop_auto_whitelist = () => {
  return axios.get(`${ip}/setting/pause-autoupdatewhiteiplist`);
}
