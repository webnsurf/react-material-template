import { AppActionTypes } from 'store/types';

import { AFTER_SET_ORGANISATION } from '../organisation/actions';
import { UserState, User } from './types';
import {
  BEFORE_AUTHENTICATE,
  AFTER_AUTHENTICATE,
  AFTER_AUTHENTICATE_ERROR,
  AFTER_LOGOUT,
} from './actions';

const initialUser: User = {
  id: '',
  name: '',
  email: '',
  image: '',
};

const initialUserState: UserState = {
  isAuthenticating: true,
  isLoggedIn: false,
  user: initialUser,
  roleId: -1,
};

export const userReducer = (state = initialUserState, action: AppActionTypes): UserState => {
  switch (action.type) {
    case BEFORE_AUTHENTICATE: {
      return {
        ...state,
        isAuthenticating: true,
      };
    }
    case AFTER_AUTHENTICATE: {
      return {
        ...state,
        isAuthenticating: false,
        isLoggedIn: true,
        user: action.user,
      };
    }
    case AFTER_AUTHENTICATE_ERROR: {
      return {
        ...state,
        isAuthenticating: false,
        isLoggedIn: false,
      };
    }
    case AFTER_SET_ORGANISATION: {
      return {
        ...state,
        roleId: action.organisation?.roleId || initialUserState.roleId,
      };
    }
    case AFTER_LOGOUT: {
      return {
        ...initialUserState,
        isAuthenticating: false,
      };
    }
    default: {
      return state;
    }
  }
};

export * from './actions';
export * from './selectors';
