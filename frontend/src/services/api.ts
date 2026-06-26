import axios from 'axios';
const host = window.location.hostname;

const api = axios.create({
  baseURL: `http://${host}:3000/api/v1`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('barpos-auth');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const token = parsed?.state?.token || parsed?.token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch { /* ignore */ }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('barpos-auth');
      window.location.href = '/login';
    }
    const backendMsg = error.response?.data?.error?.message;
    if (backendMsg) {
      error.message = backendMsg;
    }
    return Promise.reject(error);
  }
);

export default api;
