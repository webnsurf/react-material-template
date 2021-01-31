import { API } from 'api';
import { DataTree } from 'store/data-tree/types';

const getUrl = (url = '') => `data-tree/${url}`;

export const dataTreeAPI = {
  getDataTree: async () => {
    const response = await API.get<DataTree>(getUrl());
    return response.data;
  },
};
