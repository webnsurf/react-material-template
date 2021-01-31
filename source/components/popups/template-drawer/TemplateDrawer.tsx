import React, { FC, useCallback, useMemo } from 'react';
import Drawer from '@material-ui/core/Drawer';

import { usePopup } from 'store/popups';
import { usePopupActions } from 'store/popups/actions';
import { Form } from 'components/forms';
import { PopupName } from 'store/popups/types';

export const TemplateDrawer: FC = () => {
  const { isOpen, data } = usePopup(PopupName.newOrganisation);
  const actions = usePopupActions();
  const onSubmit = useCallback(async submitData => {
    // eslint-disable-next-line no-console
    console.log(submitData);
    actions.close(PopupName.newOrganisation);
  }, []);
  const initialData = useMemo(() => ({ ...data }), [data]);

  const handleClose = useCallback(() => {
    actions.close(PopupName.newOrganisation);
  }, [actions]);

  return (
    <Drawer anchor="right" open={isOpen} onClose={handleClose}>
      <Form
        onSubmit={onSubmit}
        initialValues={initialData}
        className="sec-form"
        buttonLabel="Save"
        buttonWidth="100%"
      >
        Form
      </Form>
    </Drawer>
  );
};
