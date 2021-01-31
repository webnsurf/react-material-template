import { AppActionTypes } from 'store/types';

import { PopupName, PopupsState } from './types';
import { OPEN_POPUP, CLOSE_POPUP } from './actions';

const initialState: PopupsState = Object.keys(PopupName).reduce(
  (acc, key) => ({ ...acc, [key]: { isOpen: false } }),
  {} as PopupsState,
);

export const popupsReducer = (state = initialState, action: AppActionTypes): PopupsState => {
  switch (action.type) {
    case OPEN_POPUP: {
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          isOpen: true,
          data: action.data,
        },
      };
    }
    case CLOSE_POPUP: {
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          isOpen: false,
        },
      };
    }

    default: {
      return state;
    }
  }
};

export * from './selectors';
