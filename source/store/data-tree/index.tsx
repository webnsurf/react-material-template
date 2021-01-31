import { AFTER_LOGOUT } from '../user';
import { AppActionTypes } from '../types';
import { DataTreeState, DataTree } from './types';
import { BEFORE_GET_DATA_TREE, AFTER_GET_DATA_TREE, AFTER_GET_DATA_TREE_ERROR } from './actions';

const initialDataTree: DataTree = {
  userRoles: [],
};

const initialDataTreeState: DataTreeState = {
  isLoading: true,
  data: initialDataTree,
};

export const dataTreeReducer = (
  state = initialDataTreeState,
  action: AppActionTypes,
): DataTreeState => {
  switch (action.type) {
    case BEFORE_GET_DATA_TREE: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case AFTER_GET_DATA_TREE: {
      return {
        ...state,
        isLoading: false,
        data: action.data,
      };
    }
    case AFTER_GET_DATA_TREE_ERROR: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case AFTER_LOGOUT: {
      return {
        ...initialDataTreeState,
        isLoading: false,
      };
    }
    default: {
      return state;
    }
  }
};

export * from './actions';
export * from './selectors';
