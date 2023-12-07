import { useState } from "react";
import {
  get,
  getThreshold,
  update,
  updateThreshold,
} from "@/services/Setting/distributed";

import { message } from "antd";

export default () => {
  const [loading, setLoading] = useState<boolean[]>(
    new Array(1).fill(false)
  );

  const [data, setData] = useState<any>({
    center_domain: "",
    center_username: "",
    center_password: "",
    cpu_threshold: "",
    ram_threshold: "",
    active: ""
  });

  const [threshold, setThreshold] = useState<any>({
    cpu_threshold: -1,
    ram_threshold: -1,
    latency_threshold: -1,
    active_distributed: false,
    active_distributed_receive: false
  });

  const getData = async () => {
    setLoading([true]);
    const res = await get();
    if (res.status === 200) {
      setData(res.data);
    }
    setLoading([false]);
  };

  const updateData = async (data: any) => {
    setLoading([true]);
    const res = await update(data);
    if (res.status === 200) {
      message.success("Cập nhật thành công");
    }
    setLoading([false]);
  };

  const getThresholdDistributed = async () => {
    setLoading([true]);
    const res = await getThreshold();
    if (res.status === 200) {
      setThreshold(res.data);
    }
    setLoading([false]);
  };

  const updateThresholdDistributed = async (data: any) => {
    setLoading([true]);
    const res = await updateThreshold(data);
    if (res.status === 200) {
      message.success("Cập nhật thành công");
    }
    setLoading([false]);
  };

  return {
    loading,
    data,
    getData,
    updateData,
    getThresholdDistributed,
    updateThresholdDistributed,
    threshold
  };
}
