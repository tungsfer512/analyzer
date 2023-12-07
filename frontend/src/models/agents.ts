import { installAgent, killAgent } from '@/services/agents';
import { message, notification } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import {
  get_auto_check_overload,
  put_auto_check_overload,
} from "@/services/Setting/autocheckoverload";

import {
  get_auto_clear_sftp,
  put_auto_clear_sftp,
} from "@/services/Setting/autoclearsftp";

export default () => {
  const devices = useModel('devices');
  const [timeCheckOverload, setTimeCheckOverload] = useState<any>(-1); // eslint-disable-line
  const [timeClearSftp, setTimeClearSftp] = useState<any>(-1); // eslint-disable-line
  const [loading, setLoading] = useState<boolean[]>(
    new Array(2).fill(false)
  );

  const [dataAutoCheckOverload, setDatatAutoCheckOverload] = useState<any>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [dataAutoClearSftp, setDatatAutoClearSftp] = useState<any>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const getDataAutoTime = (time: number) => {
    // console.log(time);
    if (time === -1) return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    if (time >= 86400) {
      days = Math.floor(time / 86400);
      time = time - days * 86400;
      if (time >= 3600) {
        hours = Math.floor(time / 3600);
        time = time - hours * 3600;
        if (time >= 60) {
          minutes = Math.floor(time / 60);
          time = time - minutes * 60;
          seconds = time;
        }
      }
    }
    const data = {
      days,
      hours,
      minutes,
      seconds,
    };

    return data;
  }

  const install = (id: any) => {
    installAgent(id)
      .then(() => {
        devices.getData();
        // Thông báo thêm thành công
        notification.success({
          message: 'Đã gửi yêu cầu cài tác tử thành công',
          placement: 'bottomLeft',
        });
      })
  };

  const kill = (id: any) => {
    killAgent(id)
      .then(() => {
        devices.getData();
        // Thông báo thêm thành công
        notification.success({
          message: 'Đã gửi yêu cầu xóa tác tử thành công',
          placement: 'bottomLeft',
        });
      })
  };

  const getAutoCheckOverload = async () => {
    try {
      setLoading(loading.map((item, index) => (index === 0 ? true : item)));
      const response = await get_auto_check_overload().then((res) => {
        // console.log(res);
        setTimeCheckOverload(res?.data);
        // console.log(Number(res?.data));
        setDatatAutoCheckOverload(getDataAutoTime(Number(res?.data)));
        setLoading(loading.map((item, index) => (index === 0 ? false : item)));
        console.log(dataAutoCheckOverload);
      });
    } catch (error) {
      setLoading(loading.map((item, index) => (index === 0 ? false : item)));
      message.error('Lỗi thực hiện')
    }
    return undefined;
  }

  const updateAutoCheckOverload = async (seconds: number) => {
    try {
      // console.log(seconds);
      setLoading(loading.map((item, index) => (index === 0 ? true : item)));
      const response = await put_auto_check_overload(seconds);
      console.log(response.data);
      // setTimeBlacklist(response.data);
      setLoading(loading.map((item, index) => (index === 0 ? false : item)));
    } catch (error) {
      setLoading(loading.map((item, index) => (index === 0 ? false : item)));
      // setTimeBlacklist(-1);
    }
  }

  const getAutoClearSftp = async () => {
    try {
      setLoading(loading.map((item, index) => (index === 1 ? true : item)));
      const response = await get_auto_clear_sftp().then((res) => {
        // console.log(res);
        setTimeClearSftp(res?.data);
        // console.log(Number(res?.data));
        setDatatAutoClearSftp(getDataAutoTime(Number(res?.data)));
        setLoading(loading.map((item, index) => (index === 1 ? false : item)));
        console.log(dataAutoClearSftp);
      });
    } catch (error) {
      setLoading(loading.map((item, index) => (index === 1 ? false : item)));
      message.error('Lỗi thực hiện')
    }
    return undefined;
  }

  const updateAutoClearSftp = async (minutes: number) => {
    try {
      // console.log(minutes);
      setLoading(loading.map((item, index) => (index === 1 ? true : item)));
      const response = await put_auto_clear_sftp(minutes);
      console.log(response.data);
      // setTimeBlacklist(response.data);
      setLoading(loading.map((item, index) => (index === 1 ? false : item)));
    } catch (error) {
      setLoading(loading.map((item, index) => (index === 1 ? false : item)));
      // setTimeBlacklist(-1);
    }
  }


  return { install, kill, getAutoCheckOverload, updateAutoCheckOverload, getAutoClearSftp, updateAutoClearSftp, timeCheckOverload, timeClearSftp, loading, dataAutoCheckOverload, dataAutoClearSftp };
};
