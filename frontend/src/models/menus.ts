import Service from '@/pages/QuanLyMenu/service';
import { ActionType } from '@ant-design/pro-table';
import { useRef, useState } from 'react';
import baseModel from './baseModel';

export interface IMenuRecord {
  id: string;
  name: string;
  code: string;
  code_parent: string;
}

export default () => {
  const actionRef = useRef<ActionType>();
  const [danhSach, setDanhSach] = useState<IMenuRecord[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<IMenuRecord | {}>({});

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
