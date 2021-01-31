import React, { FC, Fragment } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { useParams } from 'react-router';

import { Spinner, Message, Icon, Button } from 'components/common';
import { useCanEditUsers } from 'store/access-control';
import { organisationAPI } from 'api/organisation';
import { useApi } from 'hooks/api';

import { OrganisationRouteParams } from '../../../constants';
import { UsersListItem } from './UsersListItem';
import { NewUser } from './NewUser';

export const Users: FC<UsersProps> = () => {
  const { orgId } = useParams<OrganisationRouteParams>();
  const [users, isLoading, { reFetch }] = useApi(organisationAPI.getUsers, [], {
    fetchData: orgId,
  });
  const canEditUsers = useCanEditUsers();

  if (isLoading) {
    return <Spinner />;
  }

  const renderContent = () => {
    if (!users.length) {
      return <div className="not-found">No Users belong to this organisation</div>;
    }

    return (
      <Fragment>
        {!canEditUsers && (
          <Message
            type="info"
            message="Please contact one of your organisation administrators to edit users"
          />
        )}

        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="table-cell-image" />
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell className="table-cell-role">Role</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map(user => (
              <UsersListItem orgId={orgId} key={user.id} reLoadUsers={reFetch} {...user} />
            ))}
          </TableBody>
        </Table>
      </Fragment>
    );
  };

  return (
    <div className="sec-organisation-users">
      {renderContent()}

      {canEditUsers && (
        <NewUser
          orgId={orgId}
          reLoadUsers={reFetch}
          renderActions={modal => (
            <div className="add-user-button-wrapper">
              <Button onClick={() => modal.open()} width={250} size="large">
                <Icon type="add" marginRight={5} /> Add user
              </Button>
            </div>
          )}
        />
      )}
    </div>
  );
};

interface UsersProps {
  orgId: string;
}
