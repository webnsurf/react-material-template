import { Action } from 'redux';

import { Organisation } from '../organisation/types';
import {
  BEFORE_AUTHENTICATE,
  AFTER_AUTHENTICATE,
  AFTER_LOGOUT,
  AFTER_AUTHENTICATE_ERROR,
} from './actions';

export interface User {
  id: string;
  email: string;
  name: string;
  image: string;
}

interface UserOrganisation extends Organisation {
  role: {
    id: number;
    name: string;
  };
}

export interface UserResponse extends User {
  organisations: UserOrganisation[];
}

export interface UserState {
  user: User;
  isLoggedIn: boolean;
  isAuthenticating: boolean;
  roleId: number;
}

interface BeforeAuthenticateAction extends Action {
  type: typeof BEFORE_AUTHENTICATE;
}

interface AfterAuthenticateAction extends Action {
  type: typeof AFTER_AUTHENTICATE;
  user: User;
}

interface AfterAuthenticateErrorAction extends Action {
  type: typeof AFTER_AUTHENTICATE_ERROR;
}

interface AfterLogourAction extends Action {
  type: typeof AFTER_LOGOUT;
}

export type UserActionTypes =
  | BeforeAuthenticateAction
  | AfterAuthenticateAction
  | AfterAuthenticateErrorAction
  | AfterLogourAction;
