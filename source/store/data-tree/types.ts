import { Action } from 'redux';

import { BEFORE_GET_DATA_TREE, AFTER_GET_DATA_TREE, AFTER_GET_DATA_TREE_ERROR } from './actions';

export interface UserRole {
  id: number;
  name: string;
}

export interface DataTree {
  userRoles: UserRole[];
}

export interface DataTreeState {
  isLoading: boolean;
  data: DataTree;
}

interface BeforeGetDataTreeAction extends Action {
  type: typeof BEFORE_GET_DATA_TREE;
}

interface AfterGetDataTreeAction extends Action {
  type: typeof AFTER_GET_DATA_TREE;
  data: DataTree;
}

interface AfterGetDataTreeErrorAction extends Action {
  type: typeof AFTER_GET_DATA_TREE_ERROR;
}

export type DataTreeActionTypes =
  | BeforeGetDataTreeAction
  | AfterGetDataTreeAction
  | AfterGetDataTreeErrorAction;
