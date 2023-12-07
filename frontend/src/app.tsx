import React from 'react';
import type { BasicLayoutProps, Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { Button, notification } from 'antd';
import { RequestConfig, useModel } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import type { ResponseError } from 'umi-request';
import { queryCurrent, getCurrentInfo } from './services/user';
import defaultSettings from '../config/defaultSettings';
import logo from '../public/logo.jpg';
import ErrorPage from '@/pages/Authorized/ErrorPage';
import { logout } from './services/logout';
import { rawIP } from './services/ip';
import ReconnectingWebSocket from 'reconnecting-websocket';

export const initialStateConfig = {
  loading: <PageLoading />,
};

const fetchUserInfo = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      history.push('/user/login');
      return undefined;
    }
    const currentUser = await queryCurrent();
    return currentUser;
  } catch (error) {
    history.push('/user/login');
  }
  return undefined;
};

export async function getInitialState(): Promise<{
  settings?: LayoutSettings;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  groupMenu: any;
}> {
  if (history.location.pathname !== '/user/login') {
    const currentUser = await fetchUserInfo();
    let groupMenusResponse = {};
    try {
      const username = localStorage.getItem('username');
      groupMenusResponse = await getCurrentInfo(username);
    } catch (err) {
      history.push('/user/login');
    }
    const vaiTro = localStorage.getItem('vaiTro');
    console.log(groupMenusResponse, 'groupMenusResponse');
    const groupMenu = (groupMenusResponse?.data ?? []).filter(
      (item) => item?.group?.id === parseInt(vaiTro),
    )?.[0];

    return {
      fetchUserInfo,
      currentUser,
      groupMenu: groupMenu,
      settings: defaultSettings,
    };
  }

  return {
    // fetchUserInfo,
    settings: defaultSettings,
  };
}

export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings; currentUser?: API.CurrentUser };
}): BasicLayoutProps => {
  return {
    logo: logo,
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { currentUser } = initialState;
      const { location } = history;
      if (location.pathname !== 'user/login') {
        fetchUserInfo();
      }
    },
    menuHeaderRender: undefined,
    ...initialState?.settings,
    // ErrorComponent: (err) => <ErrorPage />,
  };
};

const codeMessage = {
  200: 'Lỗi 200',
  201: 'Lỗi 201',
  202: 'Lỗi 202',
  204: 'Lỗi 204',
  400: 'Lỗi 400',
  401: 'Lỗi 401',
  403: 'Lỗi 403',
  404: 'Lỗi 404',
  405: 'Lỗi 405',
  406: 'Lỗi 406',
  410: 'Lỗi 410',
  422: 'Lỗi 422',
  500: 'Lỗi 500',
  502: 'Lỗi 502',
  503: 'Lỗi 503',
  504: 'Lỗi 504',
};

const errorHandler = (error: ResponseError) => {
  const { response } = error;
  console.log(response, 'request error');
  if (response && response.status) {
    const errorText = response.statusText || codeMessage[response.status];
    const { status, url } = response;
    if (status === 401) {
      logout();
    }
    // if (status !== 401) {
    notification.error({
      message: `Gặp lỗi ${status}: ${url}`,
      description: errorText,
    });
    // }
  }

  if (!response) {
    notification.error({
      description: 'Đã xảy ra lỗi',
      message: 'Vui lòng kiểm tra lại',
    });
  }
  // throw error;
};

const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => {
  const token = localStorage.getItem('token');
  const authHeader = { ...(token && { Authorization: `Token ${token}` }) };
  return {
    url: `${url}`,
    options: { ...options, interceptors: true, headers: authHeader },
  };
};

export const request: RequestConfig = {
  errorHandler,
  requestInterceptors: [authHeaderInterceptor],
};
