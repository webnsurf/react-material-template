import { Action } from 'redux';

import { User } from '../user/types';
import {
  AFTER_SET_ORGANISATION,
  AFTER_SET_ORGANISATIONS_LIST,
  AFTER_CREATE_ORGANISATION,
  AFTER_RESET,
} from './actions';

export interface Organisation {
  id: string;
  name: string;
  url: string;
  roleId: number;
}

export interface OrganisationUser extends User {
  roleId: number;
}

export type OrganisationAction<ActionData = any, SuccessData = any, ErrorData = any> = (
  data: ActionData,
  onSuccess?: ((data?: SuccessData) => any) | null | false,
  onError?: ((data?: ErrorData) => any) | null | false,
) => Promise<void>;

export interface OrganisationState {
  all: Organisation[];
  selected?: Organisation;
}

export interface AfterSetOrganisationAction extends Action {
  type: typeof AFTER_SET_ORGANISATION;
  organisation?: Organisation;
}
export interface AfterSetOrganisationsListAction extends Action {
  type: typeof AFTER_SET_ORGANISATIONS_LIST;
  organisations: Organisation[];
}
export interface AfterCreateOrganisationAction extends Action {
  type: typeof AFTER_CREATE_ORGANISATION;
  organisation: Organisation;
}
export interface AfterResetOrganisationAction extends Action {
  type: typeof AFTER_RESET;
}

export type OrganisationActionTypes =
  | AfterSetOrganisationAction
  | AfterSetOrganisationsListAction
  | AfterCreateOrganisationAction
  | AfterResetOrganisationAction;
