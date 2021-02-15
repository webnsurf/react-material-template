import React, { FC, useCallback, Fragment, useRef } from 'react';

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
import { useSelectedOrganisation } from 'store/organisation';

export const RoleColumn: FC<RoleColumnProps> = ({ reLoadUsers, id: userId, email, roleId }) => {
  const authenticate = useAuthenticate();
  const resetOrganisations = useResetOrganisations();
  const organisation = useSelectedOrganisation();
  const canEditUsers = useCanEditUsers();
  const userRoles = useUserRolesData();
  const { id: currentUserId } = useUser();
  const selectorKey = useRef(0);
  const isSameUser = userId === currentUserId;
  const orgId = organisation?.id;

  const handleUpdateRole = useCallback(
    async ({ value }) => {
      if (orgId && value !== roleId) {
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
          selectorKey.current += 1;
        }
      }
    },
    [roleId, orgId, userId, isSameUser, userRoles, authenticate, reLoadUsers],
  );

  const handleDeleteUser = useCallback(async () => {
    if (orgId) {
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
    }
  }, [orgId, userId, isSameUser, reLoadUsers, resetOrganisations, authenticate]);

  return (
    <div className="user-role-selector">
      <Popconfirm
        title={
          <span>
            If you change your own role <u>you will lose</u>
            <br />
            administrative access to the organisation
          </span>
        }
        disabled={!canEditUsers || !isSameUser}
        className="sec-same-user-role"
        disableButtons
        width={270}
      >
        <div className="selecotr-wrapper">
          <UserRoleSelector
            onChange={handleUpdateRole}
            defaultValue={roleId}
            disabled={!canEditUsers}
          />
        </div>
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
          position="leftTop"
        >
          <IconButton type="delete" color="error" className="delete" title={`Delete ${email}`} />
        </Popconfirm>
      )}
    </div>
  );
};

export interface RoleColumnProps extends OrganisationUser {
  reLoadUsers?: (orgId: string) => any;
}
