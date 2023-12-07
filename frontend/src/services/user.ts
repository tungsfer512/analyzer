import { request  } from 'umi';
import { ip } from './ip';
import axios from '@/utils/axios';

export async function query() {
  // return request<API.CurrentUser[]>('/api/users');
  return [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ];
}

export async function getCurrentInfo(username) {
  return request<API.CurrentUser>(`${ip}/users/get-current-info/${username}`);
}

export async function queryCurrent() {
  return request<API.CurrentUser>(`${ip}/auth/users/me/`);
  // return {
  //   name: 'Admin',
  //   avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
  //   userid: '00000001',
  //   email: 'admin@gmail.com',
  //   signature: 'Admin',
  //   title: 'Admin',
  //   group: 'Admin',
  //   tags: [],
  //   notifyCount: 12,
  //   unreadCount: 11,
  //   country: 'VN',
  //   access: 'admin',
  //   // access: 'guest',
  //   geographic: {
  //     province: {
  //       label: 'HN',
  //       key: '330000',
  //     },
  //     city: {
  //       label: 'HN',
  //       key: '330100',
  //     },
  //   },
  //   address: 'Thanh Xuân, Hà Nội',
  //   phone: '0337348333',
  // };
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}
