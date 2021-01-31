import { Action } from 'redux';

import { ModalProps } from 'components/common/modal';
import { OrganisationCreateData } from 'api/organisation/types';

import { OPEN_POPUP, CLOSE_POPUP } from './actions';

export interface Popup<DataType> {
  isOpen: boolean;
  data?: Partial<DataType>;
}

export enum PopupName {
  newOrganisation = 'newOrganisation',
}

export interface PopupsState {
  [PopupName.newOrganisation]: Popup<NewOrganisationModalProps>;
}

interface OpenPopupAction extends Action {
  type: typeof OPEN_POPUP;
  name: PopupName;
  data: PopupsState[PopupName]['data'];
}
interface ClosePopupAction extends Action {
  type: typeof CLOSE_POPUP;
  name: PopupName;
}

export type PopupsActionTypes = OpenPopupAction | ClosePopupAction;

interface PopupModalProps {
  onOpen?: ModalProps['onOpen'];
  onClose?: ModalProps['onClose'];
}

export interface NewOrganisationModalProps extends PopupModalProps {
  organisation?: OrganisationCreateData;
  onSubmit?: (data: OrganisationCreateData) => any;
  onError?: (error: any) => any;
}
