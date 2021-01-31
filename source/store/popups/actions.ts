import { useEffect, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { usePopup } from './selectors';
import { PopupName, PopupsState } from './types';

export const OPEN_POPUP = 'OPEN_POPUP';
export const CLOSE_POPUP = 'CLOSE_POPUP';

export const baseActions = {
  openPopup: (name: PopupName, data: any) => ({
    type: OPEN_POPUP,
    name,
    data,
  }),
  closePopup: (name: PopupName) => ({
    type: CLOSE_POPUP,
    name,
  }),
};

export const usePopupActions = () => {
  const dispatch = useDispatch();
  return useMemo(
    () => ({
      open: <Name extends PopupName>(name: Name, data?: PopupsState[Name]['data']) =>
        dispatch(baseActions.openPopup(name, data)),
      close: (name: PopupName) => dispatch(baseActions.closePopup(name)),
    }),
    [dispatch],
  );
};

export const useOnPopupClose = (name: PopupName, callback: (name: PopupName) => any) => {
  const { isOpen } = usePopup(name);
  const previousIsOpen = useRef(isOpen);

  useEffect(() => {
    if (previousIsOpen.current && !isOpen) {
      callback(name);
    }

    previousIsOpen.current = isOpen;
  }, [name, callback, isOpen]);
};
