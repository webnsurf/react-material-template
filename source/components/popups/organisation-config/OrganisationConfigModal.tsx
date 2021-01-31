import React, { FC, useCallback, useMemo } from 'react';

import { resolveError } from 'api/utils';
import { OrganisationCreateData } from 'api/organisation/types';
import { usePopup } from 'store/popups';
import { usePopupActions } from 'store/popups/actions';
import { useCreateOrganisation } from 'store/organisation/actions';
import { NewOrganisationModalProps, PopupName } from 'store/popups/types';
import { notifications } from 'utils/notifications';

import { Modal } from '../../common';
import { Form, Input } from '../../forms';

export const OrganisationConfigModal: FC = () => {
  const { isOpen, data } = usePopup(PopupName.newOrganisation);
  const { organisation, onSubmit, onError, onOpen, onClose } = data || {};
  const actions = usePopupActions();
  const createOrganisation = useCreateOrganisation();
  const handleOpen = useCallback(() => onOpen && onOpen(), [onOpen]);
  const handleClose = useCallback(() => {
    setTimeout(() => actions.close(PopupName.newOrganisation), 250);

    if (onClose) {
      onClose();
    }
  }, [onClose, actions]);
  const handleSubmit = useCallback(
    async (orgData: OrganisationCreateData) => {
      try {
        if (!organisation) {
          await createOrganisation(orgData);
        }

        if (onSubmit) {
          onSubmit(orgData);
        }

        handleClose();
      } catch (axiosError) {
        notifications.error(resolveError(axiosError));

        if (onError) {
          onError(axiosError);
        }
      }
    },
    [onSubmit, handleClose, onError],
  );

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      width={550}
      initiallyOpen
      className="sec-new-organisation"
      heading="Enter organisation details below:"
      onOpen={handleOpen}
      onClose={handleClose}
    >
      <Form initialValues={organisation} onSubmit={handleSubmit} buttonLabel="Create">
        <Input className="input" name="name" label="Name" required />
        <Input name="url" label="Organisation URL" className="input" />
      </Form>
    </Modal>
  );
};

export const useOrganisationConfigModal = () => {
  const popups = usePopupActions();

  return useMemo(
    () => ({
      update: (data?: NewOrganisationModalProps) => popups.open(PopupName.newOrganisation, data),
      new: () => popups.open(PopupName.newOrganisation),
      close: () => popups.close(PopupName.newOrganisation),
    }),
    [popups],
  );
};
