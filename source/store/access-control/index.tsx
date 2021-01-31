import { AFTER_LOGOUT } from '../user';
import { AppActionTypes } from '../types';
import { AccessControlState, AccessControl } from './types';
import {
  BEFORE_GET_ACESS_CONTROL,
  AFTER_GET_ACESS_CONTROL,
  AFTER_GET_ACESS_CONTROL_ERROR,
} from './actions';

const initialAccessControl: AccessControl = {
  organisation: {
    editUsers: [],
  },
};

const initialAccessControlState: AccessControlState = {
  isLoading: true,
  data: initialAccessControl,
};

export const accessControlReducer = (
  state = initialAccessControlState,
  action: AppActionTypes,
): AccessControlState => {
  switch (action.type) {
    case BEFORE_GET_ACESS_CONTROL: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case AFTER_GET_ACESS_CONTROL: {
      return {
        ...state,
        isLoading: false,
        data: action.data,
      };
    }
    case AFTER_GET_ACESS_CONTROL_ERROR: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case AFTER_LOGOUT: {
      return {
        ...initialAccessControlState,
        isLoading: false,
      };
    }
    default: {
      return state;
    }
  }
};

export * from './actions';
export * from './selectors';
