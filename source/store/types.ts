import { UserState, UserActionTypes } from './user/types';
import { OrganisationState, OrganisationActionTypes } from './organisation/types';
import { SettingsState, SettingsActionTypes } from './settings/types';
import { DataTreeState, DataTreeActionTypes } from './data-tree/types';
import { AccessControlState, AccessControlActionTypes } from './access-control/types';
import { PopupsState, PopupsActionTypes } from './popups/types';

export interface AppState {
  user: UserState;
  organisation: OrganisationState;
  settings: SettingsState;
  dataTree: DataTreeState;
  accessControl: AccessControlState;
  popups: PopupsState;
}

export type AppActionTypes =
  | UserActionTypes
  | OrganisationActionTypes
  | SettingsActionTypes
  | DataTreeActionTypes
  | AccessControlActionTypes
  | PopupsActionTypes;
