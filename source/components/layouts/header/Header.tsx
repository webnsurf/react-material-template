import React, { Fragment } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AppBar } from '@material-ui/core';

import { Dropdown, DropdownItem, Icon } from 'components/common';
import { useOrganisationConfigModal } from 'components/popups/organisation-config';
import { useSelectedOrganisation, useOrganisationsList } from 'store/organisation';
import { useLogout } from 'store/user';
import { getNewOrganisationUrl } from 'utils/router';
import { ORGANISATION_PAGES_ARR } from 'modules/organisation/constants';

export const Header = () => {
  const organisation = useSelectedOrganisation();
  const organisations = useOrganisationsList();
  const orhanisationConfig = useOrganisationConfigModal();
  const logout = useLogout();

  return (
    <AppBar className="sec-header">
      <menu>
        <Link to="/" className="logo">
          <Icon type="home" size={30} />
        </Link>

        {organisation && (
          <Fragment>
            {ORGANISATION_PAGES_ARR.map(page => {
              const pageLink = page.getLink(organisation.id);

              return (
                <NavLink to={pageLink} key={pageLink}>
                  <Icon type={page.nav.icon} />
                  {page.nav.buttonLabel}
                </NavLink>
              );
            })}
          </Fragment>
        )}
      </menu>

      <div className="main-controls">
        <Link to="/docs" target="_blank" className="docs">
          <Icon type="books" />
        </Link>

        <Dropdown
          className="header-dropdown"
          displayValue={organisation?.name || 'Please select...'}
        >
          {organisations.length !== 0 && (
            <div className="organisations-list">
              {organisations.map(({ id, name }) => (
                <DropdownItem
                  key={id}
                  title={`${name} | ${id}`}
                  linkTo={getNewOrganisationUrl(id)}
                  className="organisations-list-item"
                >
                  {name}
                </DropdownItem>
              ))}
            </div>
          )}

          <div className="header-actions">
            <DropdownItem onClick={orhanisationConfig.new}>
              <Icon type="add" className="action-icon" marginRight={10} size={26} round />
              New Organisation
            </DropdownItem>

            <DropdownItem onClick={logout}>
              <Icon
                className="action-icon logout"
                type="meetingRoom"
                marginRight={11}
                marginLeft={1}
              />
              Logout
            </DropdownItem>
          </div>
        </Dropdown>
      </div>
    </AppBar>
  );
};
