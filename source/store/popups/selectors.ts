import { useSelector } from 'react-redux';

import { AppState } from '../types';
import { PopupName, PopupsState } from './types';

export const usePopup = <Name extends PopupName>(name: Name) =>
  useSelector<AppState, PopupsState[Name]>(({ popups }) => popups[name]);
