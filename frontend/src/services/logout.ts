import { history } from 'umi';

export async function logout() {
  // Remove token from localstorage
  localStorage.removeItem('token');
  history.push('/user/login');
}
