import React, { FC, memo, useCallback, useRef } from 'react';

import { Modal, ModalProps } from 'components/common/modal';
import { Form, Input } from 'components/forms';
import { UserRoleSelector } from 'components/layouts';
import { AddUserRequest } from 'api/organisation/types';
import { organisationAPI } from 'api/organisation';
import { notifications } from 'utils/notifications';

export const NewUser: FC<NewUserProps> = memo(({ orgId, reLoadUsers, ...rest }) => {
  const modalRef = useRef<Modal>(null);
  const onSubmit = useCallback(
    async (values: AddUserRequest) => {
      await organisationAPI.addUser(orgId, values);

      notifications.success({
        message: (
          <span>
            <b>{values.email}</b> added to organisation
          </span>
        ),
        delay: 8000,
      });

      if (reLoadUsers) {
        reLoadUsers(orgId);
      }

      if (modalRef.current) {
        modalRef.current.close();
      }
    },
    [orgId, reLoadUsers],
  );

  return (
    <Modal
      heading="Enter user details below"
      className="sec-add-user"
      ref={modalRef}
      width={500}
      {...rest}
    >
      <Form onSubmit={onSubmit} buttonLabel="Add User">
        <UserRoleSelector name="roleId" label="User role" className="field" required />

        <Input label="User email" className="field" name="email" type="email" required />
      </Form>
    </Modal>
  );
});

interface NewUserProps extends ModalProps {
  orgId: string;
  reLoadUsers?: (orgId: string) => any;
}
