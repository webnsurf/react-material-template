import { Action } from 'redux';

import {
  BEFORE_GET_ACESS_CONTROL,
  AFTER_GET_ACESS_CONTROL,
  AFTER_GET_ACESS_CONTROL_ERROR,
} from './actions';

export interface AccessControl {
  organisation: {
    delete: number[];
    editUsers: number[];
  };
}

export interface AccessControlState {
  isLoading: boolean;
  data: AccessControl;
}

interface BeforeGetAccessControlAction extends Action {
  type: typeof BEFORE_GET_ACESS_CONTROL;
}

interface AfterGetAccessControlAction extends Action {
  type: typeof AFTER_GET_ACESS_CONTROL;
  data: AccessControl;
}

interface AfterGetAccessControlErrorAction extends Action {
  type: typeof AFTER_GET_ACESS_CONTROL_ERROR;
}

export type AccessControlActionTypes =
  | BeforeGetAccessControlAction
  | AfterGetAccessControlAction
  | AfterGetAccessControlErrorAction;
