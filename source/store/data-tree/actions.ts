import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { dataTreeAPI } from 'api/data-tree';
import { resolveError } from 'api/utils';

import { DataTree } from './types';

export const BEFORE_GET_DATA_TREE = 'BEFORE_GET_DATA_TREE';
export const AFTER_GET_DATA_TREE = 'AFTER_GET_DATA_TREE';
export const AFTER_GET_DATA_TREE_ERROR = 'AFTER_GET_DATA_TREE_ERROR';

export const baseActions = {
  beforeGetDataTree: () => ({
    type: BEFORE_GET_DATA_TREE,
  }),
  afterGetDataTree: (data: DataTree) => ({
    type: AFTER_GET_DATA_TREE,
    data,
  }),
  afterGetDataTreeError: () => ({
    type: AFTER_GET_DATA_TREE_ERROR,
  }),
};

export const useLoadDataTree = () => {
  const dispatch = useDispatch();

  return useCallback(async () => {
    dispatch(baseActions.beforeGetDataTree());

    try {
      const dataTree = await dataTreeAPI.getDataTree();

      dispatch(baseActions.afterGetDataTree(dataTree));
    } catch (error) {
      dispatch(baseActions.afterGetDataTreeError());
      resolveError(error);
    }
  }, [dispatch]);
};
