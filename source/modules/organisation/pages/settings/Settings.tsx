import React, { FC, useCallback } from 'react';
import { Redirect, Switch, Route, useParams } from 'react-router';
import { NavLink } from 'react-router-dom';

import { Sidebar } from 'components/layouts';
import { Icon, Button, Popconfirm } from 'components/common';
import { useDeleteOrganisation } from 'store/organisation/actions';
import { useCanDeleteOrganisation } from 'store/access-control';

import { OrganisationRouteParams, SETTINGS_TABS, SETTINGS_TABS_ARR } from '../../constants';

const { users } = SETTINGS_TABS;

export const SettingsPage: FC = () => {
  const { orgId } = useParams<OrganisationRouteParams>();
  const deleteOrganisation = useDeleteOrganisation();
  const handleDelete = useCallback(() => deleteOrganisation(orgId), [deleteOrganisation, orgId]);
  const canDelete = useCanDeleteOrganisation();

  return (
    <div className="sec-settings-page">
      <Sidebar className="settings-sidebar" partial>
        <div className="sidebar-content">
          {SETTINGS_TABS_ARR.map(tab => {
            const tabLink = tab.getLink(orgId);

            return (
              <NavLink className="link" to={tabLink} key={tabLink} activeClassName="active">
                <Button>
                  <div className="icon">
                    <Icon type={tab.icon} />
                  </div>
                  {tab.buttonLabel}
                </Button>
              </NavLink>
            );
          })}

          {canDelete && (
            <Popconfirm
              title="Are you sure you want to remove this organisation?"
              onConfirm={handleDelete}
              placement="bottomLeft"
              okText="Yes"
            >
              <div className="link">
                <Button variant="text" className="delete">
                  <div className="icon">
                    <Icon type="delete" />
                  </div>
                  Remove organisation
                </Button>
              </div>
            </Popconfirm>
          )}
        </div>
      </Sidebar>

      <div className="main-content">
        <Switch>
          <Route path={users.path} component={users.component} />
          <Redirect to={users.getLink(orgId)} />
        </Switch>
      </div>
    </div>
  );
};
