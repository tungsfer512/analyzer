import { useState, useEffect } from 'react';
import {
  getDevice,
  startTracing,
  stopTracing,
  getSyscallList,
  getDeviceAlert,
  getDeviceIntegrity,
  killProcessService,
  rebootDeviceService,
  startTracingNetwork,
  stopTracingNetwork,
  getDeviceAlertById,
} from '@/services/device_detail';
import { notification } from 'antd';
import { useModel } from 'umi';

export default () => {
  const [data, setData] = useState([]);
  const [syscall, setDataSyscall] = useState([]);
  const [alerts, setDataAlerts] = useState({
    count: 0,
    result: [],
  });
  const [loading, setLoading] = useState(true);
  const [tracing, setTracing] = useState('');

  const [arrModalSyscall, setArrModalSyscall] = useState([]);
  const [visibleModalSyscall, setVisibleModalSyscall] = useState(false);
  const [thongTinThietBi, setthongTinThietBi] = useState({});

  const getAlertById = (payload) => {
    getDeviceAlertById(payload)
    .then((res) => {
      setDataAlerts(
        res ?? {
          count: 0,
          result: [],
        },
      );
    })
    .finally(() => {
      // setLoading(false);
    });
  }
  const getDataAlert = (payload) => {
    // setLoading(true);
    getDeviceAlert(payload)
      .then((res) => {
        setDataAlerts(
          res ?? {
            count: 0,
            result: [],
          },
        );
      })
      .finally(() => {
        // setLoading(false);
      });
  };

  const getData = (device_id: string, searchKey: any, filter: any) => {
    setLoading(true);
    getDevice(device_id, searchKey, filter)
      .then((res) => {
        setData(res?.process_list ?? []);
        console.log(res, 'res');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getDataSyscall = (device_id: string) => {
    setLoading(true);
    getSyscallList(device_id)
      .then((res) => {
        setDataSyscall(res || []);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const startTraceNetwork = async (device_id) => {
    let res;
    setLoading(true)
    startTracingNetwork({ device_id }).then(data => {
      console.log(data, 'data')
      if (data?.message) {
        notification.error({
          message: data?.message?? '1',
          placement: 'bottomLeft',
        });
        return;
      }
      notification.success({
        message:  'Bắt đầu theo dõi luồng mạng hệ thống',
        placement: 'bottomLeft',
      });
    }).finally(() => {
      setLoading(false);
    });

  }

  const stopTraceNetwork = (device_id) => {
    let id = device_id;
    if (!device_id) {
      id = thongTinThietBi?.id;
    }
    stopTracingNetwork({device_id})
    .then((res) => {
      notification.success({
        message: 'Đã gửi yêu cầu dừng theo dõi luồng mạng hệ thống',
        placement: 'bottomLeft',
      });
    })
    .finally(() => {
      setLoading(false);
    });
  }

  const startTrace = (device_id, pid) => {
    startTracing({ device_id, pid })
      .then((res) => {
        notification.success({
          message: 'Bắt đầu theo dõi hệ thống',
          placement: 'bottomLeft',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const stopTrace = (device_id: string, pid: string) => {
    let id = device_id;
    if (!device_id) {
      id = thongTinThietBi?.id;
    }

    stopTracing({ device_id: id, pid })
      .then((res) => {
        notification.success({
          message: 'Đã gửi yêu cầu dừng theo dõi lời gọi hệ thống',
          placement: 'bottomLeft',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const killProcess = (alert_id, device_id, pid) => {
    setLoading(true);
    killProcessService({ alert_id, device_id, pid })
      .then((res) => {
        notification.success({
          message: 'Đã gửi yêu cầu dừng tiến trình',
          placement: 'bottomLeft',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const rebootDevice = (id) => {
    setLoading(true);
    rebootDeviceService({ id })
      .then((res) => {
        notification.success({
          message: 'Đã khởi động lại thiết bị',
          placement: 'bottomLeft',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    loading,
    setLoading,
    data,
    syscall,
    setData,
    tracing,
    setTracing,
    getData,
    startTrace,
    stopTrace,
    getDataSyscall,
    getDataAlert,
    getAlertById,
    alerts,
    killProcess,
    rebootDevice,
    arrModalSyscall,
    setArrModalSyscall,
    visibleModalSyscall,
    setVisibleModalSyscall,
    setthongTinThietBi,
    thongTinThietBi,
    startTraceNetwork,
    stopTraceNetwork
  };
};
