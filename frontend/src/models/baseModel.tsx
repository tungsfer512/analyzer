import notificationAlert from '@/components/Notification';
import BaseService from '@/services/baseService';
import type { ActionType } from '@ant-design/pro-table';

export interface IPayload {
    page: number,
    limit: number,
    cond: object,
}

export default <T extends unknown>(
    service: BaseService<T>,
    setDanhSach: React.Dispatch<React.SetStateAction<T[]>>,
    setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>,
    setEdit: React.Dispatch<React.SetStateAction<boolean>>,
    setRecord: React.Dispatch<React.SetStateAction<T | {}>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    actionRef: React.MutableRefObject<ActionType | undefined>,
) => {
    const handleForm = (handleShowDrawer: boolean, handleEdit: boolean, handleRecord: T | {}) => {
        setShowDrawer(handleShowDrawer);
        setEdit(handleEdit);
        setRecord(handleRecord);
    }
    const get = async (payload: IPayload): Promise<{ data: T[], total: number }> => {
        try {
          // console.log('payload', payload);
            setLoading(true);
            const response = await service.get(payload);
            let arr = response?.data?.data ?? [];
            arr = arr.map((item: T, index: number) => ({
                ...(item as object),
                index: index + 1 + (payload.page - 1) * payload.limit,
            }))
            setDanhSach(arr);
            setLoading(false);
            return {
                data: arr,
                total: response?.data?.total ?? 0,
            };
        } catch (error) {
            notificationAlert('error', 'Lỗi khi tải dữ liệu')
        }
        return {
            data: [],
            total: 0,
        };
    }
    const add = async (payload: any): Promise<void> => {
        try {
            await service.add(payload);
            // await get({
            //     page: 1,
            //     limit: 10,
            //     cond: {}
            // });
            if (actionRef) {
                await actionRef?.current?.reloadAndRest?.();
            }
            handleForm(false, false, {})
            notificationAlert('success', 'Thêm mới thành công')
        } catch (error) {
            notificationAlert('error', 'Lỗi thực hiện')
        }
    }

    const add2 = async (payload: any): Promise<void> => {
      try {
          await service.add2(payload);
          // await get({
          //     page: 1,
          //     limit: 10,
          //     cond: {}
          // });
          if (actionRef) {
              await actionRef?.current?.reloadAndRest?.();
          }
          handleForm(false, false, {})
          notificationAlert('success', 'Thêm mới thành công')
      } catch (error) {
          notificationAlert('error', 'Lỗi thực hiện')
      }
  }

    const upd = async (payload: any): Promise<void> => {
        try {
            await service.upd(payload);
            // await get({
            //     page: 1,
            //     limit: 10,
            //     cond: {}
            // });
            handleForm(false, false, {})
            if (actionRef) {
                await actionRef?.current?.reloadAndRest?.();
            }
            notificationAlert('success', 'Chỉnh sửa thành công')
        } catch (error) {
            notificationAlert('error', 'Lỗi thực hiện')
        }
    }
    const del = async (id: string): Promise<void> => {
        try {
            await service.del(id);
            // await get({
            //     page: 1,
            //     limit: 10,
            //     cond: {}
            // });
            if (actionRef) {
                await actionRef?.current?.reloadAndRest?.();
            }
            notificationAlert('success', 'Xóa thành công')
        } catch (error) {
            notificationAlert('error', 'Lỗi thực hiện')
        }
    }
    /**
     * Hàm custom để dùng chung
     * @param payload Payload được truyền vào
     * @param func Hàm xử lý được viết ở model
     */
    const customFunc = async (payload: any, func: any) => {
        try {
            setLoading(true);
            await func(payload);
            setLoading(false);
        } catch (error) {
            notificationAlert('error', 'Lỗi thực hiện')
        }
    }
    return {
        get,
        add, // k có /
        add2, // có /
        upd,
        del,
        handleForm,
        customFunc,
    }
}
