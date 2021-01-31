import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { accessControlAPI } from 'api/access-control';
import { resolveError } from 'api/utils';

import { AccessControl } from './types';

export const BEFORE_GET_ACESS_CONTROL = 'BEFORE_GET_ACESS_CONTROL';
export const AFTER_GET_ACESS_CONTROL = 'AFTER_GET_ACESS_CONTROL';
export const AFTER_GET_ACESS_CONTROL_ERROR = 'AFTER_GET_ACESS_CONTROL_ERROR';

export const baseActions = {
  beforeGetAccessControl: () => ({
    type: BEFORE_GET_ACESS_CONTROL,
  }),
  afterGetAccessControl: (data: AccessControl) => ({
    type: AFTER_GET_ACESS_CONTROL,
    data,
  }),
  afterGetAccessControlError: () => ({
    type: AFTER_GET_ACESS_CONTROL_ERROR,
  }),
};

export const useLoadAccessControl = () => {
  const dispatch = useDispatch();

  return useCallback(async () => {
    dispatch(baseActions.beforeGetAccessControl());

    try {
      const accessControl = await accessControlAPI.getAccessControl();

      dispatch(baseActions.afterGetAccessControl(accessControl));
    } catch (error) {
      dispatch(baseActions.afterGetAccessControlError());
      resolveError(error);
    }
  }, [dispatch]);
};
