import { getSettings, setSidebarSettings } from 'utils/storage/settings';

import { AppActionTypes } from '../../types';
import { SidebarState } from './types';
import { AFTER_OPEN_SIDEBAR, AFTER_CLOSE_SIDEBAR, AFTER_TOGGLE_SIDEBAR } from './actions';

const initialSidebar = getSettings().sidebar;

export const sidebarReducer = (state = initialSidebar, action: AppActionTypes): SidebarState => {
  switch (action.type) {
    case AFTER_OPEN_SIDEBAR: {
      return setSidebarSettings({ ...state, isOpen: true });
    }
    case AFTER_CLOSE_SIDEBAR: {
      return setSidebarSettings({ ...state, isOpen: false });
    }
    case AFTER_TOGGLE_SIDEBAR: {
      return setSidebarSettings({ ...state, isOpen: !state.isOpen });
    }
    default: {
      return state;
    }
  }
};
