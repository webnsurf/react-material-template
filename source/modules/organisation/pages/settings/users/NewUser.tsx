import React, { FC, memo, useCallback } from 'react';

import { ModalProps } from 'components/common/modal';
import { Form, Input } from 'components/forms';
import { UserRoleSelector } from 'components/layouts';
import { AddUserRequest } from 'api/organisation/types';
import { organisationAPI } from 'api/organisation';
import { notifications } from 'utils/notifications';

export const NewUser: FC<NewUserProps> = memo(({ orgId, reLoadUsers, ...rest }) => {
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
    },
    [orgId, reLoadUsers],
  );

  return (
    <Form
      onSubmit={onSubmit}
      buttonLabel="Add User"
      className="sec-add-user"
      modalHeading="Enter user details below"
      modalProps={rest}
    >
      <UserRoleSelector name="roleId" label="User role" className="field" required />

      <Input label="User email" className="field" name="email" type="email" required />
    </Form>
  );
});

interface NewUserProps extends ModalProps {
  orgId: string;
  reLoadUsers?: (orgId: string) => any;
}
