import { useSelector } from 'react-redux';

import { AppState } from '../types';
import { UserState } from './types';

export const useIsAuthenticating = () =>
  useSelector<AppState, UserState['isAuthenticating']>(
    ({ user: userState }) => userState.isAuthenticating,
  );

export const useIsLoggedIn = () =>
  useSelector<AppState, UserState['isLoggedIn']>(({ user: userState }) => userState.isLoggedIn);

export const useUser = () =>
  useSelector<AppState, UserState['user']>(({ user: userState }) => userState.user);

export const useUserState = () =>
  useSelector<AppState, UserState>(({ user: userState }) => userState);
