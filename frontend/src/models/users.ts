import Service from '@/pages/QuanLyNguoiDung/service';
import { ActionType } from '@ant-design/pro-table';
import { useRef, useState } from 'react';
import baseModel from './baseModel';

export interface IUserRecord {
  id: string;
  password: string;
  confirmPassword?: string;
  last_login: string;
  is_superuser: boolean;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  groups: Array<number>;
}

export default () => {
  const actionRef = useRef<ActionType>();
  const [danhSach, setDanhSach] = useState<IUserRecord[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<IUserRecord | {}>({});

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
  return {
    value: {
      danhSach,
      showDrawer,
      edit,
      record,
      loading,
      actionRef,
    },
    dispatch: {
      ...model,
    },
  };
};
