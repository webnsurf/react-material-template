import React from 'react';
import { Avatar } from '@material-ui/core';

import { TableColumn } from 'components/common/table';
import { OrganisationUser } from 'store/organisation/types';

import { RoleColumn, RoleColumnProps } from './RoleColumn';

export const getColumns = (
  reloadUsers: RoleColumnProps['reLoadUsers'],
): TableColumn<OrganisationUser>[] => [
  {
    dataIndex: 'image',
    className: 'user-image-cell',
    align: 'right',
    render: (_, { data: { image, name } }) => <Avatar src={image} alt={name} />,
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    dataIndex: 'roleId',
    className: 'user-role-selector-cell',
    title: 'Role',
    render: (_, { data }) => <RoleColumn reLoadUsers={reloadUsers} {...data} />,
  },
];
