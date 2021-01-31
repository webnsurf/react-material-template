import { createStore, combineReducers } from 'redux';

import { isDevelopment } from 'app-constants';

import { userReducer } from './user';
import { organisationReducer } from './organisation';
import { settingsReducer } from './settings';
import { dataTreeReducer } from './data-tree';
import { accessControlReducer } from './access-control';
import { AppState, AppActionTypes } from './types';
import { popupsReducer } from './popups';

const win = window as any;
// eslint-disable-next-line no-underscore-dangle
const reduxDevtoolsExtension = win.__REDUX_DEVTOOLS_EXTENSION__;

const rootReducer = combineReducers<AppState, AppActionTypes>({
  user: userReducer,
  organisation: organisationReducer,
  settings: settingsReducer,
  dataTree: dataTreeReducer,
  accessControl: accessControlReducer,
  popups: popupsReducer,
});

export const store = createStore(
  rootReducer,
  {},
  isDevelopment && reduxDevtoolsExtension ? reduxDevtoolsExtension() : undefined,
);
