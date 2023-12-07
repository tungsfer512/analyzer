// axios.js
import axios from 'axios';
// Add a request interceptor
axios.interceptors.request.use(
  config => {
    if (
      // config.baseURL === baseApiAddress &&
      !config.headers.Authorization
    ) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Token ${token}`;
        // config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

export default axios;
