import { useSelector } from 'react-redux';

import { AppState } from '../types';
import { DataTreeState, DataTree } from './types';

export const useIsDataTreeLoading = () =>
  useSelector<AppState, DataTreeState['isLoading']>(({ dataTree }) => dataTree.isLoading);

export const useUserRolesData = () =>
  useSelector<AppState, DataTree['userRoles']>(
    ({ dataTree: { data: dataTree } }) => dataTree.userRoles,
  );

export const useDataTreeState = () =>
  useSelector<AppState, DataTreeState>(({ dataTree }) => dataTree);
