import axios from "@/utils/axios";
import { ip } from "@/services/ip";

export const get_auto_clear_sftp = () => {
  return axios.get(`${ip}/agents/auto-clear-sftp`);
  // return { data: 3600 };
}

export const put_auto_clear_sftp = (minutes: number) => {
  return axios.put(`${ip}/agents/auto-clear-sftp`, { minutes: minutes });
}
