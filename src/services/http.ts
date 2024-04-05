import axios from 'axios';
import { useRouter } from 'vue-router';
import type { AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { useAppStore } from '@/stores/app.store';

export const useHttp = () => {
  const router = useRouter();
  const appStore = useAppStore();

  const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL, //window.location.origin,
    timeout: 30000,
  });

  function requestInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    config.headers = config.headers || {};
    if (config.headers['Content-Type'] === undefined) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  }

  function responseInterceptor(response: AxiosResponse): AxiosResponse {
    return response.data;
  }

  function responseInterceptorOnError(error: AxiosError): Promise<AxiosError> {
    if (error.response?.status === 401) {
      router.push({ name: 'login' });
    }
    return Promise.reject(error);
  }

  http.interceptors.request.use(requestInterceptor);
  http.interceptors.response.use(responseInterceptor, responseInterceptorOnError);
  appStore.isLoading.value = false;
  return { http };
};
