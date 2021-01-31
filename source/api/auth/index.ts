import { API } from 'api';
import { UserResponse } from 'store/user/types';

import { AuthLoginRequest, AuthRegisterRequest } from './types';

const getUrl = (url = '') => `auth/${url}`;

export const authAPI = {
  authenticate: async () => {
    const response = await API.get<UserResponse>(getUrl('authenticate'));
    return response.data;
  },

  register: async (data: AuthRegisterRequest) => {
    const response = await API.post<UserResponse>(getUrl('register'), data);
    return response.data;
  },

  login: async (data: AuthLoginRequest) => {
    const response = await API.post<UserResponse>(getUrl('login'), data);
    return response.data;
  },

  logout: async () => {
    const response = await API.get(getUrl('logout'));
    return response.data;
  },
};
