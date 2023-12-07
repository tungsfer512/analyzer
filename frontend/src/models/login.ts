import { logout as logoutService } from '@/services/logout';
import { useState } from 'react';
import { login as loginService, LoginParamsType } from '@/services/login';
import { message } from 'antd';
import { history, useModel } from 'umi';

export default () => {
  const [loading, setloading] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');

  const logout = () => {
    setloading(true);
    setInitialState({ ...initialState, currentUser: undefined });
    logoutService();
    setloading(false);
  };

  const login = async (values: LoginParamsType) => {
    setloading(true);
    try {
      const msg = await loginService({ ...values });
      // Save token to local storage
      console.log(msg)
     
      const token = msg.auth_token;

      localStorage.setItem('token', token);
      history.push('/');
    } catch (error) {
      message.error('Sai thông tin đăng nhập');
    }
    setloading(false);
  };
  return { loading, logout, login };
};
