import { AppActionTypes } from 'store/types';

import { AFTER_LOGOUT } from '../user';
import { OrganisationState } from './types';
import {
  AFTER_SET_ORGANISATION,
  AFTER_SET_ORGANISATIONS_LIST,
  AFTER_CREATE_ORGANISATION,
  AFTER_RESET,
} from './actions';

const initialOrganisationState: OrganisationState = {
  selected: undefined,
  all: [],
};

export const organisationReducer = (
  state = initialOrganisationState,
  action: AppActionTypes,
): OrganisationState => {
  switch (action.type) {
    case AFTER_SET_ORGANISATION: {
      return {
        ...state,
        selected: action.organisation,
      };
    }
    case AFTER_SET_ORGANISATIONS_LIST: {
      return {
        ...state,
        all: action.organisations,
      };
    }
    case AFTER_CREATE_ORGANISATION: {
      return {
        ...state,
        selected: action.organisation,
        all: [...state.all, action.organisation],
      };
    }

    case AFTER_RESET: {
      return {
        ...initialOrganisationState,
      };
    }

    case AFTER_LOGOUT: {
      return { ...initialOrganisationState };
    }
    default: {
      return state;
    }
  }
};

export * from './selectors';
