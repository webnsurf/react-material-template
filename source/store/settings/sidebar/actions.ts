import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

export const AFTER_OPEN_SIDEBAR = 'AFTER_OPEN_SIDEBAR';
export const AFTER_CLOSE_SIDEBAR = 'AFTER_CLOSE_SIDEBAR';
export const AFTER_TOGGLE_SIDEBAR = 'AFTER_TOGGLE_SIDEBAR';

export const baseActions = {
  afterOpenSidebar: () => ({
    type: AFTER_OPEN_SIDEBAR,
  }),
  afterCloseSidebar: () => ({
    type: AFTER_CLOSE_SIDEBAR,
  }),
  afterToggleSidebar: () => ({
    type: AFTER_TOGGLE_SIDEBAR,
  }),
};

export const useSidebarActions = () => {
  const dispatch = useDispatch();

  const actions = useMemo(
    () => ({
      open: () => dispatch(baseActions.afterOpenSidebar()),
      close: () => dispatch(baseActions.afterCloseSidebar()),
      toggle: () => dispatch(baseActions.afterToggleSidebar()),
    }),
    [dispatch],
  );

  return actions;
};
