import { API } from 'api';
import { AccessControl } from 'store/access-control/types';

const getUrl = (url = '') => `access-control/${url}`;

export const accessControlAPI = {
  getAccessControl: async () => {
    const response = await API.get<AccessControl>(getUrl());
    return response.data;
  },
};
