import { useSelector } from 'react-redux';

import { AppState } from '../types';
import { AccessControlState } from './types';

export const useIsAccessControlLoading = () =>
  useSelector<AppState, AccessControlState['isLoading']>(
    ({ accessControl }) => accessControl.isLoading,
  );

export const useOrganisationsAccess = () =>
  useSelector<AppState, AccessControlState['data']>(({ accessControl }) => accessControl.data);

export const useCanEditUsers = () =>
  useSelector<AppState, boolean>(({ accessControl: { data }, user: { roleId } }) =>
    data.organisation.editUsers.includes(roleId),
  );

export const useCanDeleteOrganisation = () =>
  useSelector<AppState, boolean>(({ accessControl: { data }, user: { roleId } }) =>
    data.organisation.delete.includes(roleId),
  );

export const useAccessControlState = () =>
  useSelector<AppState, AccessControlState>(({ accessControl }) => accessControl);
