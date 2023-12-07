import Service from '@/pages/QuanLyNhomNguoiDung/service';
import { ActionType } from '@ant-design/pro-table';
import { useRef, useState } from 'react';
import baseModel from './baseModel';

export interface IGroupRecord {
  id: string;
  name: string;
  menus: number[];
}

export default () => {
    const actionRef = useRef<ActionType>();
    const [danhSach, setDanhSach] = useState<IGroupRecord[]>([]);
    const [showDrawer, setShowDrawer] = useState(false);
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [record, setRecord] = useState<IGroupRecord | {}>({});


    const model = baseModel(
        Service,
        setDanhSach,
        setShowDrawer,
        setEdit,
        setRecord,
        setLoading,
        actionRef
    );
    /**
     * Hàm custom 
     * @param payloadToModel payload truyền từ component đến models
     */
    const customFunc = (payloadToModel: any) => {
        model.customFunc(payloadToModel, async (payload: any) => {
            // Phần xử lý
        })
    }
    return ({
        value: {
            danhSach,
            showDrawer,
            edit,
            record,
            loading,
            actionRef
        },
        dispatch: {
            ...model,
        }
    });
};