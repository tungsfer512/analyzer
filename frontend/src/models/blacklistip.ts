import { message } from 'antd';
import Service from '@/pages/QuanLyDanhSachIp/BlackListIp/services';
import { ActionType } from '@ant-design/pro-table';
import { useRef, useState } from 'react';
import baseModel from './baseModel';
import notificationAlert from '@/components/Notification';

export interface IBlackListIpRecord {
  id: string;
  url: string
}

export default () => {
  const actionRef = useRef<ActionType>();
  const [danhSach, setDanhSach] = useState<IBlackListIpRecord[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<IBlackListIpRecord | {}>({});

  const model = baseModel(
    Service,
    setDanhSach,
    setShowDrawer,
    setEdit,
    setRecord,
    setLoading,
    actionRef,
  );
  /**
   * Hàm custom
   * @param payloadToModel payload truyền từ component đến models
   */
  const customFunc = (payloadToModel: any) => {
    model.customFunc(payloadToModel, async (payload: any) => {
      // Phần xử lý
    });
  };

  const get = async (payload: any): Promise<{ data: any[], total: number }> => {
    try {
      setLoading(true);
      const pathname = window.location.pathname;
      const arrPath = pathname.split('/');
      console.log(arrPath);
      let response;
      if (arrPath[1] === 'device') {
        response = await Service.getIpInDevice({ ...payload, id: parseInt(arrPath[2]) });
      } else {
        response = await Service.get(payload);
      }
      console.log(response)
      let arr = response?.results ?? [];
      arr = arr.map((item: IBlackListIpRecord, index: number) => ({
        ...(item as object),
        index: index + 1 + (payload.page - 1) * payload.limit,
        key: index + 1 + (payload.page - 1) * payload.limit,
      }))
      console.log('arr', arr);

      setDanhSach(arr);
      setLoading(false);
      return {
        data: arr,
        total: response?.count ?? 0,
      };
    } catch (error) {
      notificationAlert('error', 'Lỗi khi tải dữ liệu')
    }
    return {
      data: [],
      total: 0,
    };

  }

  const del_all = async () => {
    try {
      setLoading(true);
      const res = await Service.del_all();
      if (res.status === 200) {
        message.success('Xóa thành công');
        const response = await Service.get({
          page: 1,
          limit: 10,
          current: 1,
          pageSize: 10,
        });
        let arr = response?.results ?? [];
        arr = arr.map((item: IBlackListIpRecord, index: number) => ({
          ...(item as object),
          index: index + 1 + (1 - 1) * 10,
          key: index + 1 + (1 - 1) * 10,
        }))
        setDanhSach(arr);
        setLoading(false);
        return {
          data: arr,
          total: response?.count ?? 0,
        };
      }
    } catch (error) {
      message.error('Lỗi thực hiện');
    } finally {
      setLoading(false);
    }
  };

  return {
    value: {
      danhSach,
      setDanhSach,
      showDrawer,
      edit,
      record,
      loading,
      actionRef,
    },
    danhSach,
    setShowDrawer,
    dispatch: {
      ...model,
      get,
    },
    del_all,
  };
};
