import axios from 'axios';

import { API_PREFIX } from 'app-constants';
import { sleep } from 'utils/general';

import { getHeaders } from './utils';

export const API = {
  async get<T = any>(url: string, delay?: number) {
    if (delay) {
      await sleep(delay);
    }

    return axios.get<T>(`${API_PREFIX}/${url}`, getHeaders());
  },
  async post<T = any>(url: string, data: { [key: string]: any }, delay?: number) {
    if (delay) {
      await sleep(delay);
    }

    return axios.post<T>(`${API_PREFIX}/${url}`, data, getHeaders());
  },
  async patch<T = any>(url: string, data: { [key: string]: any }, delay?: number) {
    if (delay) {
      await sleep(delay);
    }

    return axios.patch<T>(`${API_PREFIX}/${url}`, data, getHeaders());
  },
  async delete<T = any>(url: string, delay?: number) {
    if (delay) {
      await sleep(delay);
    }

    return axios.delete<T>(`${API_PREFIX}/${url}`, getHeaders());
  },
};
