import React, { FC, useMemo } from 'react';
import { useParams } from 'react-router';

import { Message, Icon, Button, Table } from 'components/common';
import { useCanEditUsers } from 'store/access-control';
import { organisationAPI } from 'api/organisation';
import { useApi } from 'hooks/api';

import { OrganisationRouteParams } from '../../../constants';
import { NewUser } from './NewUser';
import { getColumns } from './structure';

export const Users: FC<UsersProps> = () => {
  const { orgId } = useParams<OrganisationRouteParams>();
  const [users, isLoading, { reFetch }] = useApi(organisationAPI.getUsers, [], {
    fetchData: orgId,
  });
  const canEditUsers = useCanEditUsers();
  const columns = useMemo(() => getColumns(reFetch), [reFetch]);

  return (
    <div className="sec-organisation-users">
      {!canEditUsers && (
        <Message
          type="info"
          marginBottom={15}
          message="Please contact one of your organisation administrators to edit users"
        />
      )}

      <Table columns={columns} data={users} size="medium" loading={isLoading} />

      {canEditUsers && (
        <NewUser
          orgId={orgId}
          reLoadUsers={reFetch}
          renderActions={modal => (
            <div className="add-user-button-wrapper">
              <Button onClick={modal.open} width={250} size="large">
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
