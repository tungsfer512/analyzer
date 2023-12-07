import { upload_pcap, auto_extract, download_all_file, get_devices } from '@/services/uploadFile';
import { ip } from '@/services/ip';
import { useState } from "react";
import moment from 'moment';

export default () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);

  const getDevices = async () => {
    const res = await get_devices();
    console.log(res);
    // setData(res.data);
    setDevices(res.data.results)
  }

  const up = async (payload: { formData: FormData }) => {
    try {
      setLoading(true);
      const res = await upload_pcap(payload);
      console.log(res);
      setData(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setData([]);
    }
  };

  const autoExtract = async (payload: any) => {
    try {
      console.log(payload)
      console.log(payload.timestamp[0])
      console.log(payload.timestamp[0].unix())
      const payloadd = {
        "device_id": payload.device,
        "start": payload.timestamp[0].unix(),
        "end": payload.timestamp[1].unix()
      }
      setLoading2(true);
      const res = await auto_extract(payloadd);
      console.log(res);
      setData(res.data);
      setLoading2(false);
    } catch (error) {
      setLoading2(false);
      setData([]);
    }
  };

  const dowload = async (payload) => {
    window.open(`${ip}/${payload.path}`, '_blank');
  };

  const dowloadAll = async () => {
    try {
      setLoading(true);
      const res = await download_all_file();
      console.log(res);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setData([]);
    }
  };

  return {
    loading,
    setLoading,
    loading2,
    setLoading2,
    data,
    setData,
    devices,
    setDevices,

    up,
    dowload,
    dowloadAll,
    autoExtract,
    getDevices,
  };
};
