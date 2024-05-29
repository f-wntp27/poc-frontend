import { useHttp } from './http';
import type { BaseResponse } from '@/models/common.model';
import type { AxiosRequestConfig } from 'axios';

export const useHttpService = () => {
  const { http } = useHttp();

  async function get<T>(url: string, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
    return http.request({
      method: 'GET',
      url: url,
      ...config,
    });
  }

  async function post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
    return http.request({
      method: 'POST',
      url: url,
      data: data,
      ...config,
    });
  }

  async function download(url: string, config?: AxiosRequestConfig): Promise<Blob> {
    return http.request({
      method: 'GET',
      url: url,
      responseType: 'blob',
      ...config,
    });
  }

  return { get, post, download };
};
