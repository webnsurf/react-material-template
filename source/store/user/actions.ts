import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { authAPI } from 'api/auth';
import { AuthLoginRequest, AuthRegisterRequest } from 'api/auth/types';
import { resolveError } from 'api/utils';
import { checkIsLoggedIn, getLastUrl, setLastUrl, removeLastUrl } from 'utils/storage/auth';
import { notifications } from 'utils/notifications';

import { checkIsAuthPage } from 'utils/router';

import { AUTH_PAGES } from 'modules/authentication/constants';

import { useSetOrganisationList } from '../organisation/actions';
import { User } from './types';

export const BEFORE_AUTHENTICATE = 'BEFORE_AUTHENTICATE';
export const AFTER_AUTHENTICATE = 'AFTER_AUTHENTICATE';
export const AFTER_AUTHENTICATE_ERROR = 'AFTER_AUTHENTICATE_ERROR';
export const AFTER_LOGOUT = 'AFTER_LOGOUT';

export const baseActions = {
  beforeAuthenticate: () => ({
    type: BEFORE_AUTHENTICATE,
  }),
  afterAuthenticate: (user: User) => ({
    type: AFTER_AUTHENTICATE,
    user,
  }),
  afterAuthenticateError: () => ({
    type: AFTER_AUTHENTICATE_ERROR,
  }),
  afterLogout: () => ({
    type: AFTER_LOGOUT,
  }),
};

export const useRegister = () => {
  const dispatch = useDispatch();
  const setOrganisationList = useSetOrganisationList();

  return useCallback(
    async (data: AuthRegisterRequest) => {
      const { organisations, ...user } = await authAPI.register(data);

      setOrganisationList(organisations);
      dispatch(baseActions.afterAuthenticate(user));
    },
    [dispatch],
  );
};

export const useLogin = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const setOrganisationList = useSetOrganisationList();

  return useCallback(
    async (data: AuthLoginRequest) => {
      const { organisations, ...user } = await authAPI.login(data);

      setOrganisationList(organisations || []);
      dispatch(baseActions.afterAuthenticate(user));

      history.push(getLastUrl() || '/');
      removeLastUrl();
    },
    [dispatch, history],
  );
};

export const useRedirectToLogin = () => {
  const history = useHistory();

  return useCallback(() => {
    if (!checkIsAuthPage()) {
      setLastUrl(window.location.pathname);
      history.push(AUTH_PAGES.login.path);
    }
  }, [history]);
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const redirectToLogin = useRedirectToLogin();

  return useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      notifications.error(resolveError(error));
    }

    dispatch(baseActions.afterLogout());
    redirectToLogin();
  }, [dispatch, redirectToLogin]);
};

export const useAuthenticate = () => {
  const dispatch = useDispatch();
  const logout = useLogout();
  const redirectToLogin = useRedirectToLogin();
  const setOrganisationList = useSetOrganisationList();

  return useCallback(async () => {
    if (checkIsLoggedIn()) {
      dispatch(baseActions.beforeAuthenticate());

      try {
        const { organisations, ...user } = await authAPI.authenticate();

        setOrganisationList(organisations || []);
        dispatch(baseActions.afterAuthenticate(user));
        return user;
      } catch (axiosError) {
        dispatch(baseActions.afterAuthenticateError());
        resolveError(axiosError);
        await logout();
        return;
      }
    }

    dispatch(baseActions.afterLogout());
    redirectToLogin();
  }, [dispatch, logout, redirectToLogin]);
};
