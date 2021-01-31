import { useSelector } from 'react-redux';

import { AppState } from '../types';
import { SettingsState } from './types';

export const useSettingsState = () =>
  useSelector<AppState, SettingsState>(({ settings: settingsState }) => settingsState);
