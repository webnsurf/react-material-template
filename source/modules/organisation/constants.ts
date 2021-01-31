import { FC } from 'react';

import { IconType } from 'components/common/icon';
import {
  createSettingsLink,
  createSettingsPath,
  OrganisationPageKey,
  SettingsTabKey,
} from 'utils/router';

import { Users } from './pages/settings/users/Users';

export const SETTINGS_TABS: SettingsTabs = {
  [SettingsTabKey.users]: {
    path: createSettingsPath(SettingsTabKey.users),
    getLink: (orgId: string) => createSettingsLink(orgId, SettingsTabKey.users),
    buttonLabel: 'Users',
    icon: 'account',
    component: Users,
  },
};

export const SETTINGS_TABS_ARR = Object.values(SETTINGS_TABS);

export const ORGANISATION_PAGES: AuthPages = {
  [OrganisationPageKey.settings]: {
    path: createSettingsPath(),
    getLink: (orgId: string) => createSettingsLink(orgId),
    nav: {
      icon: 'settings',
      buttonLabel: 'Settings',
    },
  },
};

export const ORGANISATION_PAGES_ARR = Object.values(ORGANISATION_PAGES);

interface SettingsTab {
  path: string;
  getLink: (orgId: string) => string;
  buttonLabel: string;
  icon: IconType;
  component: FC<any>;
}

type SettingsTabs = {
  [key in SettingsTabKey]: SettingsTab;
};

interface OrganisationPage {
  path: string;
  getLink: (orgId: string) => string;
  nav: {
    buttonLabel: string;
    icon: IconType;
  };
}

type AuthPages = {
  [key in OrganisationPageKey]: OrganisationPage;
};

export interface OrganisationRouteParams {
  orgId: string;
}
