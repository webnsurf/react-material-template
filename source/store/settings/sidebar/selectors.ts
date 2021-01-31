import { useSelector } from 'react-redux';

import { AppState } from '../../types';
import { SidebarState } from './types';

export const useIsSidebarOpen = () =>
  useSelector<AppState, boolean>(({ settings: settingsState }) => settingsState.sidebar.isOpen);

export const useSidebar = () =>
  useSelector<AppState, SidebarState>(({ settings: settingsState }) => settingsState.sidebar);
