import { DeepPartial } from 'redux';

import { APP_SETTINGS_KEY } from 'app-constants';
import { SettingsState } from 'store/settings/types';
import { SidebarState } from 'store/settings/sidebar/types';

import { browserStorage } from './browser';

const DEFAULT_SETTINGS: SettingsState = {
  sidebar: {
    isOpen: true,
  },
};

export const getSettings = () =>
  browserStorage.get<SettingsState>(APP_SETTINGS_KEY) || DEFAULT_SETTINGS;

export const setSettings = (newSettings: DeepPartial<SettingsState>) => {
  const oldSettings = getSettings();
  const updated: SettingsState = {
    ...oldSettings,
    sidebar: {
      ...oldSettings.sidebar,
      ...newSettings.sidebar,
    },
  };

  browserStorage.set(APP_SETTINGS_KEY, updated);

  return updated;
};

export const setSidebarSettings = (updated: Partial<SidebarState>) => {
  const { sidebar } = setSettings({ sidebar: updated });
  return sidebar;
};
