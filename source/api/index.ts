import axios from 'axios';

import { API_PREFIX } from 'app-constants';

import { getHeaders } from './utils';

export const API = {
  get<T = any>(url: string) {
    return axios.get<T>(`${API_PREFIX}/${url}`, getHeaders());
  },
  post<T = any>(url: string, data: { [key: string]: any }) {
    return axios.post<T>(`${API_PREFIX}/${url}`, data, getHeaders());
  },
  patch<T = any>(url: string, data: { [key: string]: any }) {
    return axios.patch<T>(`${API_PREFIX}/${url}`, data, getHeaders());
  },
  delete<T = any>(url: string) {
    return axios.delete<T>(`${API_PREFIX}/${url}`, getHeaders());
  },
};
