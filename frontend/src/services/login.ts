import { request  } from 'umi';
import { ip } from './ip';

export interface LoginParamsType {
  username: string;
  password: string;
  mobile: string;
  captcha: string;
  type: string;
}

// export async function fakeAccountLogin(params: LoginParamsType) {
//   // return request<API.LoginStateType>('/api/login/account', {
//   //   method: 'POST',
//   //   data: params,
//   // });
//   return {
//     status: 'ok',
//     type: 'desktop',
//     currentAuthority: 'admin',
//   };
// }

export async function login(payload: any) {
  const { username, password } = payload;
  return request(`${ip}/auth/token/login`, { method: 'POST', data: { password, username } });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  return request('/api/login/outLogin');
}
