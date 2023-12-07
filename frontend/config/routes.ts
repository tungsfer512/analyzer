import { DashboardBlank } from '../src/services/ip';

export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },

  {
    path: '/',
    redirect: '/dashboard',
  },
  // {
  //   path: `${DashboardBlank}`,
  //   target: '_blank',
  //   name: 'Dashboard',
  //   icon: 'Dashboard',
  // },
  // {
  //   path: `/dashboard-grafana`,
  //   name: 'Dashboard',
  //   icon: 'Dashboard',
  //   component: './DashboardGrafana/index.tsx',
  // },
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'Dashboard',
    maChucNang: 'DASHBOARD',
    access: 'permisionMenu',
    component: './Dashboard/index.tsx',
  },
  // {
  //   path: '/devices',
  //   name: 'Devices',
  //   maChucNang: 'QUAN_LY_THIET_BI',
  //   access: 'permisionMenu',
  //   icon: 'UnorderedListOutlined',
  //   component: './Devices/index.tsx',
  // },
  // {
  //   path: '/extract-file',
  //   name: 'ExtractFile',
  //   maChucNang: 'TRICH_XUAT_TAP_TIN',
  //   access: 'permisionMenu',
  //   icon: 'FileUnknownOutlined',
  //   component: './ExtractFile/index.tsx',
  // },
  // {
  //   path: '/device/:id',
  //   name: 'Device',
  //   hideInMenu: true,
  //   icon: 'UnorderedListOutlined',
  //   maChucNang: 'CHI_TIET_THIET_BI',
  //   access: 'permisionMenu',
  //   component: './Devices/$id.tsx',
  // },
  {
    path: '/alert',
    name: 'alert',
    maChucNang: 'CANH_BAO',
    icon: 'ExclamationCircleOutlined',
    access: 'permisionMenu',
    component: './AlertLists/CanhBaoTanCongMang/index.tsx',
  },
  // {
  //   path: '/black-white-list',
  //   name: 'black-white-list',
  //   maChucNang: 'BLACK_WHITE_LIST',
  //   icon: 'WifiOutlined',
  //   // access: 'permisionMenu',
  //   // component: './AlertLists/CanhBaoTanCongMang/index.tsx',
  //   routes: [
  //     {
  //       path: './black-list',
  //       name: 'black-list',
  //       maChucNang: 'BLACK_WHITE_LIST',
  //       component: './QuanLyDanhSachIp/BlackListIp',
  //       // access: 'permisionMenu',
  //     },
  //     {
  //       path: './white-list',
  //       name: 'white-list',
  //       maChucNang: 'BLACK_WHITE_LIST',
  //       component: './QuanLyDanhSachIp/WhiteListIp',
  //       // access: 'permisionMenu',
  //     },
  //   ]
  // },
  {
    path: '/users',
    name: 'users',
    maChucNang: 'QUAN_LY_NGUOI_DUNG',
    // access: 'permisionMenu',
    icon: 'UnorderedListOutlined',
    routes: [
      {
        path: './danh-sach-nguoi-dung',
        name: 'list-user',
        icon: 'UnorderedListOutlined',
        maChucNang: 'DANH_SACH_NGUOI_DUNG',
        component: './QuanLyNguoiDung',
        access: 'permisionMenu',
      },
      {
        path: './danh-sach-nhom-nguoi-dung',
        name: 'group-user',
        icon: 'UnorderedListOutlined',
        maChucNang: 'DANH_SACH_NHOM_NGUOI_DUNG',
        component: './QuanLyNhomNguoiDung',
        access: 'permisionMenu',
      },
      {
        path: './bang-menu',
        name: 'menu',
        maChucNang: 'MENU',
        icon: 'UnorderedListOutlined',
        component: './QuanLyMenu',
      },
    ],
  },
  {
    path: '/setting',
    name: 'setting',
    maChucNang: 'CAI_DAT',
    access: 'permisionMenu',
    icon: 'SettingOutlined',
    routes: [
      // {
      //   path: './setting-agent',
      //   name: 'auto-update-agent',
      //   maChucNang: 'CAI_DAT',
      //   component: './Setting/SettingAgent.tsx',
      //   access: 'permisionMenu',
      // },
      // {
      //   path: './setting-black-list',
      //   name: 'auto-update-black-list',
      //   maChucNang: 'CAI_DAT',
      //   component: './Setting/SettingBlackList.tsx',
      //   access: 'permisionMenu',
      // },
      // {
      //   path: './setting-white-list',
      //   name: 'auto-update-white-list',
      //   maChucNang: 'CAI_DAT',
      //   component: './Setting/SettingWhiteList.tsx',
      //   access: 'permisionMenu',
      // },
      // {
      //   path: './setting-password',
      //   name: 'auto-update-password',
      //   maChucNang: 'CAI_DAT',
      //   component: './Setting/SettingPassword.tsx',
      //   access: 'permisionMenu',
      // },
      {
        path: './setting-distributed',
        name: 'setting-distributed',
        maChucNang: 'CAI_DAT',
        icon: 'SettingOutlined',
        component: './Setting/SettingDistributed.tsx',
        // access: 'permisionMenu',
      },
      // {
      //   path: './setting-distributed-threshold',
      //   name: 'setting-distributed-threshold',
      //   maChucNang: 'CAI_DAT',
      //   icon: 'SettingOutlined',
      //   component: './Setting/SettingThresholdDistributed.tsx',
      //   // access: 'permisionMenu',
      // },
      // {
      //   path: './setting-auto-check-overload',
      //   name: 'auto-update-auto-check-overload',
      //   maChucNang: 'CAI_DAT',
      //   component: './Setting/SettingAutoCheckOverload.tsx', // chu kỳ tìm kiếm IOT Analyzer tốt nhất
      //   access: 'permisionMenu',
      // },
      // {
      //   path: './setting-auto-check-sftp',
      //   name: 'auto-update-auto-check-sftp',
      //   maChucNang: 'CAI_DAT',
      //   component: './Setting/SettingAutoCheckSftp.tsx', // Dọn dẹp bộ nhớ
      //   access: 'permisionMenu',
      // },
    ],
  },
  {
    component: './404',
  },
];
