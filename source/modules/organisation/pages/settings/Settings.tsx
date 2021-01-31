import React, { FC } from 'react';
import { Redirect, Switch, Route, useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { Button } from '@material-ui/core';

import { Sidebar } from 'components/layouts';
import { Icon } from 'components/common';

import { OrganisationRouteParams, SETTINGS_TABS, SETTINGS_TABS_ARR } from '../../constants';

const { users } = SETTINGS_TABS;

export const SettingsPage: FC = () => {
  const { orgId } = useParams<OrganisationRouteParams>();
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
