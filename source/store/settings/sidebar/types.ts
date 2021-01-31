import { Action } from 'redux';

import { AFTER_OPEN_SIDEBAR, AFTER_CLOSE_SIDEBAR, AFTER_TOGGLE_SIDEBAR } from './actions';

export interface SidebarState {
  isOpen: boolean;
}

interface AfterOpenSidebarAction extends Action {
  type: typeof AFTER_OPEN_SIDEBAR;
}

interface AfterCloseSidebarAction extends Action {
  type: typeof AFTER_CLOSE_SIDEBAR;
}

interface AfterToggleSidebarAction extends Action {
  type: typeof AFTER_TOGGLE_SIDEBAR;
}

export type SidebarActionTypes =
  | AfterOpenSidebarAction
  | AfterCloseSidebarAction
  | AfterToggleSidebarAction;
