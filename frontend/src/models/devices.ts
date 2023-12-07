import { useState, useEffect } from 'react';
import {
  getDevices,
  createDevices,
  deleteDevice,
  editDevice,
  editGioiHanDevice,
  getGioiHanDevice,
  getDevicesById,
  reloaDeviceById,
  isolateDeviceById,
  getDataTrackIp,
  installListAgent,
  unInstallListAgent,
  addIPToDevices,
  removeIPFromDevices,
} from '@/services/devices';
import { notification } from 'antd';
import notificationAlert from '@/components/Notification';

export default () => {
  const [data, setData] = useState([]);
  const [record, setRecord] = useState({ tracing_syscall: '' });
  const [listTrackIp, setListTrackIp] = useState([]);
  const [listTrackIpClone, setListTrackIpClone] = useState([]);
  const [allListTrackIp, setAllListTrackIp] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagingListTrackIp, setPagingListTracIp] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
  });
  const [recordClone, setRecordClone] = useState({ tracing_syscall: '' });
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [hasSelectKey, setHasSelectKey] = useState(false);
  const [hasSelectKeyIP, setHasSelectKeyIP] = useState(false);
  const [listDevicesBlackList, setListDevicesBlackList] = useState([]);
  const [listDevicesWhiteList, setListDevicesWhiteList] = useState([]);
  const [filter, setFilter] = useState({
    device_type: '',
    name: '',
    ip: '',
    agentInstalled: '',
  });
  const [payloadModel, setPayloadModel] = useState(undefined);

  const installListDevices = (list: number[]) => {
    installListAgent({ id: list }).then(data => {
      getData(payload);
      setHasSelectKey(false);
      setSelectedRowKeys([]);
      notification.success({
        message: 'Cài tác tử cho danh sách thiết bị thành công',
        placement: 'bottomLeft',
      });
    })
  }

  const unInstallListDevices = (list: number[]) => {
    unInstallListAgent({ id: list }).then(data => {
      getData(payload);
      setHasSelectKey(false);
      setSelectedRowKeys([]);
      notification.success({
        message: 'Gỡ tác tử cho danh sách thiết bị thành công',
        placement: 'bottomLeft',
      });
    })
  }

  const addListIPToDevices = (payload, flag, cb) => {
    addIPToDevices(payload, flag).then(data => {
      debugger;
      cb();
    }).catch(data => {
      notificationAlert('error', 'Đã xảy ra lỗi')
    })
  }

  const removeListIPFromDevices = (payload, flag, cb) => {
    removeIPFromDevices(payload, flag).then(data => {
      // debugger;
      cb();
    }).catch(data => {
      notificationAlert('error', 'Đã xảy ra lỗi')
    })
  }

  const getData = (payload) => {
    setLoading(true);
    getDevices({ ...payload }).then((res) => {
      setData((res?.results ?? []).map(item => ({
        ...item,
        agentInstalledInit: item?.agentInstalled ?? false,
      })));
    })
      .finally(() => {
        setLoading(false);
      });
  };

  const reloadDevice = (id: string) => {
    reloaDeviceById(id).then((res) => {
      notification.success({
        message: 'Đã khởi động lại thiết bị thành công',
        placement: 'bottomLeft',
      });
    })
      .finally(() => {
        setLoading(false);
      });
  };

  const isolateDevice = (id: string) => {
    isolateDeviceById(id).then((res) => {
      notification.success({
        message: 'Đã cách ly thiết bị thành công',
        placement: 'bottomLeft',
      });
    })
      .finally(() => {
        setLoading(false);
      });
  };

  const getDataById = (id: string, onComplete: Function = () => { }) => {
    setLoading(true);
    let tmp;
    getDevicesById(id).then((res) => {
      console.log(res);
      tmp = res;
      setRecord(res || {});
      setRecordClone(res || {});
    })
      .finally(() => {
        if (onComplete) {
          onComplete(tmp);
        }
        setLoading(false);
      });
  };

  const getListTrackIp = (payload: {
    device_id: string,
    current: number,
    page_size: number | undefined,
  }, onComplete: Function = () => { }) => {
    setLoading(true);
    let tmp;
    getDataTrackIp(payload).then((res) => {
      tmp = res.results;
      setPagingListTracIp({
        total: res?.count ?? 0,
        current: payload?.page ?? 1,
        pageSize: payload?.page_size ?? 10,
      });
      setListTrackIp(res?.results ?? []);
      setListTrackIpClone(res?.results ?? []);
    })
      .finally(() => {
        if (onComplete) {
          onComplete(tmp);
        }
        setLoading(false);
      });
  };

  const getAllListTrackIp = (payload: {
    ip: string,
    page: number,
    page_size: number | undefined,
  }, onComplete: Function = () => { }) => {
    setLoading(true);
    let tmp;
    getDataTrackIp(payload).then((res) => {
      tmp = res.results;
      setAllListTrackIp(res?.results ?? []);
    })
      .finally(() => {
        setLoading(false);
      });
  };

  const createData = (payload: any) => {
    setLoading(true);
    createDevices(payload).then(() => {
      setLoading(false);
      getData(undefined);

      // Thông báo thêm thành công
      notification.success({
        message: 'Thêm mới thiết bị thành công',
        placement: 'bottomLeft',
      });
    })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteData = (id: any) => {
    setLoading(true);
    deleteDevice(id).then(() => {
      setLoading(false);
      getData(undefined);

      // Thông báo xóa thành công
      notification.success({
        message: 'Xóa thiết bị thành công',
        placement: 'bottomLeft',
      });
    })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateData = (id: any, payload: any) => {
    setLoading(true);
    editDevice(id, payload).then(() => {
      setLoading(false);
      getData(undefined);

      // Thông báo chỉnh sửa thành công
      notification.success({
        message: 'Chỉnh sửa thiết bị thành công',
        placement: 'bottomLeft',
      });
    })
      .finally(() => {
        setLoading(false);
      });
  };
  const updateGioiHanData = (id: any, payload: any) => {
    setLoading(true);
    console.log("payload 111", payload)
    editGioiHanDevice(id, payload).then(() => {
      setLoading(false);
      getData(undefined);

      // Thông báo chỉnh sửa thành công
      notification.success({
        message: 'Chỉnh sửa độ chịu tải thiết bị thành công',
        placement: 'bottomLeft',
      });
    })
      .finally(() => {
        setLoading(false);
      });
  };
  const getGioiHanData = async (id: any) => {
    setLoading(true);
    const data = await getGioiHanDevice(id);
    console.log("_---------------------------", data);
    setLoading(false);
    getData(undefined);
    return data
  };

  return {
    addListIPToDevices,
    removeListIPFromDevices,
    listDevicesBlackList,
    setListDevicesBlackList,
    listDevicesWhiteList,
    setListDevicesWhiteList,
    hasSelectKeyIP,
    setHasSelectKeyIP,
    selectedRowKeys,
    setSelectedRowKeys,
    hasSelectKey,
    setHasSelectKey,
    installListDevices,
    unInstallListDevices,
    loading,
    setLoading,
    record,
    setRecord,
    recordClone,
    setRecordClone,
    data,
    listTrackIp,
    setListTrackIp,
    allListTrackIp,
    pagingListTrackIp,
    setData,
    getData,
    getDataById,
    getListTrackIp,
    getAllListTrackIp,
    createData,
    deleteData,
    updateData,
    reloadDevice,
    isolateDevice,
    listTrackIpClone,
    setListTrackIpClone,
    updateGioiHanData,
    getGioiHanData,
    filter,
    setFilter,
    payloadModel,
    setPayloadModel,
    total,
    setTotal,
  };
};
