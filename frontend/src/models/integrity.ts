import { useEffect, useState } from 'react';
// import { notification } from 'antd';
import { getDeviceIntegrity } from '@/services/integrity';

export default () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const getData = (device_id) => {
    setLoading(true);
    getDeviceIntegrity(device_id)
      .then((res) => {
        setData(res ?? []);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { loading, data, getData, total, setTotal };
};
