import React, { FC, useState, useCallback, Fragment } from 'react';
import { TableRow, TableCell, Avatar } from '@material-ui/core';
import classnames from 'classnames';

import { IconButton, Popconfirm } from 'components/common';
import { UserRoleSelector } from 'components/layouts';
import { useResetOrganisations } from 'store/organisation/actions';
import { useCanEditUsers } from 'store/access-control';
import { useAuthenticate, useUser } from 'store/user';
import { OrganisationUser } from 'store/organisation/types';
import { useUserRolesData } from 'store/data-tree';
import { organisationAPI } from 'api/organisation';
import { resolveError } from 'api/utils';
import { notifications } from 'utils/notifications';

export const UsersListItem: FC<UsersListItemProps> = ({
  orgId,
  reLoadUsers,
  id: userId,
  image,
  name,
  email,
  roleId,
}) => {
  const [isResetting, setIsResetting] = useState(false);
  const authenticate = useAuthenticate();
  const resetOrganisations = useResetOrganisations();
  const canEditUsers = useCanEditUsers();
  const userRoles = useUserRolesData();
  const { id: currentUserId } = useUser();
  const isSameUser = userId === currentUserId;

  const resetForm = () => {
    setIsResetting(true);
    setTimeout(() => setIsResetting(false), 0);
  };

  const handleUpdateRole = useCallback(
    async ({ value }) => {
      if (value !== roleId) {
        const updateUserRole = async () => {
          await organisationAPI.updateUserRole(orgId, userId, {
            roleId: value,
          });
          const newRole = userRoles.find(({ id }) => id === value);

          notifications.success({
            message: (
              <span>
                User successfully set to <b>{newRole?.name}</b>
              </span>
            ),
          });
        };

        try {
          await updateUserRole();

          if (isSameUser) {
            return authenticate();
          }

          if (reLoadUsers) {
            await reLoadUsers(orgId);
          }
        } catch (error) {
          notifications.error(resolveError(error));
          resetForm();
        }
      }
    },
    [roleId, orgId, userId, isSameUser, userRoles, authenticate, reLoadUsers],
  );

  const handleDeleteUser = useCallback(async () => {
    await organisationAPI.removeUser(orgId, userId);

    notifications.success({
      message: <span>User successfully removed from organisation</span>,
    });

    if (!isSameUser) {
      if (reLoadUsers) {
        await reLoadUsers(orgId);
      }
    } else {
      resetOrganisations();
      authenticate();
    }
  }, [orgId, userId, isSameUser, reLoadUsers, authenticate]);

  const roleClassName = classnames('table-cell-role', canEditUsers && 'with-delete');

  return (
    <TableRow key={userId} title={`${userId} | ${email}`}>
      <TableCell className="table-cell-image" align="right">
        <Avatar src={image} alt={name} />
      </TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell className={roleClassName}>
        <Popconfirm
          title={
            <span>
              If you change your own role <u>you will lose</u>
              <br />
              administrative access to the organisation
            </span>
          }
          disabled={!canEditUsers || !isSameUser}
          disableButtons
        >
          <UserRoleSelector
            onChange={handleUpdateRole}
            defaultValue={roleId}
            disabled={!canEditUsers}
            loading={isResetting}
          />
          <span />
        </Popconfirm>

        {canEditUsers && (
          <Popconfirm
            title={
              <span>
                Are you sure you want to remove
                {isSameUser ? (
                  <Fragment>
                    <b> yourself</b>?
                    <br />
                    <u>You will lose access to the organisation</u>
                  </Fragment>
                ) : (
                  <div>
                    <b>{email}</b>
                  </div>
                )}
              </span>
            }
            onConfirm={handleDeleteUser}
            arrowPointAtCenter={false}
            placement="rightTop"
          >
            <IconButton type="delete" color="error" className="delete" title={`Delete ${email}`} />
          </Popconfirm>
        )}
      </TableCell>
    </TableRow>
  );
};

interface UsersListItemProps extends OrganisationUser {
  orgId: string;
  reLoadUsers?: (orgId: string) => any;
}
