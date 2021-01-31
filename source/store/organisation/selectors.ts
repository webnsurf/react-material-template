import { useSelector } from 'react-redux';

import { AppState } from '../types';
import { OrganisationState } from './types';

export const useOrganisationsList = () =>
  useSelector<AppState, OrganisationState['all']>(({ organisation }) => organisation.all);

export const useSelectedOrganisation = () =>
  useSelector<AppState, OrganisationState['selected']>(({ organisation }) => organisation.selected);

export const useOrganisationState = () =>
  useSelector<AppState, OrganisationState>(({ organisation }) => organisation);
