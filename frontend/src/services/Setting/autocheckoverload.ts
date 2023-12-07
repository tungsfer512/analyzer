import axios from "@/utils/axios";
import { ip } from "@/services/ip";

export const get_auto_check_overload = () => {
  return axios.get(`${ip}/agents/auto-check-overload`);
  // return { data: 3600 };
}

export const put_auto_check_overload = (seconds: number) => {
  console.log(seconds);
  return axios.put(`${ip}/agents/auto-check-overload`, { "seconds": seconds });
}
