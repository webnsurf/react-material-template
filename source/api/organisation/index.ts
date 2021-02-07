import { API } from 'api';
import { Organisation, OrganisationUser } from 'store/organisation/types';

import { AddUserRequest, OrganisationCreateData, UpdateUserRoleRequest } from './types';

const getUrl = (url = '') => `organisation/${url}`;

export const organisationAPI = {
  create: async (data: OrganisationCreateData) => {
    const response = await API.post<Organisation>(getUrl(), data);
    return response.data;
  },
  delete: async (orgId: string) => {
    const response = await API.delete<void>(getUrl(orgId));
    return response.data;
  },
  getUsers: async (orgId: string) => {
    const response = await API.get<OrganisationUser[]>(getUrl(`${orgId}/users`));
    return response.data;
  },
  addUser: async (orgId: string, data: AddUserRequest) => {
    const response = await API.post<void>(getUrl(`${orgId}/users`), data);
    return response.data;
  },
  removeUser: async (orgId: string, userId: string) => {
    const response = await API.delete<void>(getUrl(`${orgId}/users/${userId}`));
    return response.data;
  },
  updateUserRole: async (orgId: string, userId: string, data: UpdateUserRoleRequest) => {
    const response = await API.patch<void>(getUrl(`${orgId}/users/${userId}`), data);
    return response.data;
  },
};
