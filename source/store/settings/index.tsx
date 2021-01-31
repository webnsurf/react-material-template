import { combineReducers } from 'redux';

import { SettingsReducer } from './types';
import { sidebarReducer } from './sidebar';

export const settingsReducer: SettingsReducer = combineReducers({
  sidebar: sidebarReducer,
});

export * from './sidebar/actions';
export * from './sidebar/selectors';
export * from './selectors';
