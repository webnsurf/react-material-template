import { Reducer } from 'redux';

import { AppActionTypes } from '../types';
import { SidebarState, SidebarActionTypes } from './sidebar/types';

export interface SettingsState {
  sidebar: SidebarState;
}

export type SettingsReducer = Reducer<SettingsState, AppActionTypes>;

export type SettingsActionTypes = SidebarActionTypes;
