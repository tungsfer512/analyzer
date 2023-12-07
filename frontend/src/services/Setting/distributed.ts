import axios from "@/utils/axios";
import { ip } from "@/services/ip";

export const get = () => {
  return axios.get(`${ip}/setting/distributed`);
  // return { data: 3600 };
}

export const update = (data: any) => {
  return axios.put(`${ip}/setting/distributed`, data);
}

export const getThreshold = () => {
  return axios.get(`${ip}/devices/threshold`);
}

export const updateThreshold = (data: any) => {
  return axios.put(`${ip}/devices/threshold`, data);
}
