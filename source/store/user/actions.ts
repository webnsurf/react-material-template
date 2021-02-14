import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { authAPI } from 'api/auth';
import { resolveError } from 'api/utils';
import { AuthLoginRequest, AuthRegisterRequest } from 'api/auth/types';
import { checkIsLoggedIn, getLastUrl, setLastUrl, removeLastUrl } from 'utils/storage/auth';
import { notifications } from 'utils/notifications';
import { checkIsAuthPage } from 'utils/router';
import { AUTH_PAGES } from 'modules/authentication/constants';
import { useLoadAccessControl } from 'store/access-control';
import { useLoadDataTree } from 'store/data-tree';

import { useSetOrganisationList } from '../organisation/actions';
import { User, UserOrganisation } from './types';

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

const useSetUser = () => {
  const dispatch = useDispatch();
  const setOrganisationList = useSetOrganisationList();
  const loadAccessControl = useLoadAccessControl();
  const loadDataTree = useLoadDataTree();

  return useCallback(
    (user: User, organisations: UserOrganisation[]) => {
      loadDataTree();
      loadAccessControl();
      setOrganisationList(organisations);
      dispatch(baseActions.afterAuthenticate(user));
    },
    [dispatch, loadAccessControl, loadDataTree, setOrganisationList],
  );
};

export const useRegister = () => {
  const setUser = useSetUser();

  return useCallback(
    async (data: AuthRegisterRequest) => {
      const { organisations, ...user } = await authAPI.register(data);
      setUser(user, organisations);
    },
    [setUser],
  );
};

export const useLogin = () => {
  const setUser = useSetUser();
  const history = useHistory();

  return useCallback(
    async (data: AuthLoginRequest) => {
      const { organisations, ...user } = await authAPI.login(data);
      setUser(user, organisations);

      history.push(getLastUrl() || '/');
      removeLastUrl();
    },
    [setUser, history],
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
  const setUser = useSetUser();
  const dispatch = useDispatch();
  const redirectToLogin = useRedirectToLogin();
  const logout = useLogout();

  return useCallback(async () => {
    if (checkIsLoggedIn()) {
      dispatch(baseActions.beforeAuthenticate());

      try {
        const { organisations, ...user } = await authAPI.authenticate();
        setUser(user, organisations);

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
  }, [dispatch, setUser, logout, redirectToLogin]);
};
