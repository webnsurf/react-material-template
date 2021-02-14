import React, { FC, useEffect, useState } from 'react';
import { Route, Redirect, Switch, useParams, useHistory } from 'react-router';

import { useSelectedOrganisation, useOrganisationsList } from 'store/organisation';
import { useSetOrganisation } from 'store/organisation/actions';
import { Header, OrganisationSelect } from 'components/layouts';
import { Popups } from 'components/popups';
import { checkIsAuthPage } from 'utils/router';

import { SettingsPage } from './pages/settings/Settings';
import { OrganisationRouteParams, ORGANISATION_PAGES } from './constants';

const { settings } = ORGANISATION_PAGES;

const OrganisationModule: FC = () => {
  const history = useHistory();
  const { orgId } = useParams<OrganisationRouteParams>();
  const organisation = useSelectedOrganisation();
  const organisations = useOrganisationsList();
  const setOrganisation = useSetOrganisation();
  const [isNotFound, setIsNotFound] = useState(false);
  const [isRouteVerified, setIsRouteVerified] = useState(false);

  useEffect(() => {
    if (checkIsAuthPage()) {
      return history.replace('/');
    }

    const newOrganisation = organisations.find(org => org.id === orgId);
    if (newOrganisation) {
      setOrganisation(newOrganisation);
      setIsNotFound(false);
    } else {
      setIsNotFound(true);
    }

    setIsRouteVerified(true);
  }, [history, orgId, organisations, setOrganisation]);

  if (!isRouteVerified) {
    return null;
  }

  const renderContent = () => {
    if (!organisation || isNotFound) {
      return (
        <div className="organisation-select">
          {isNotFound && orgId && (
            <h2 className="not-found">
              Organisation {orgId} not found
              <small>(or you don't have permissions to view it)</small>
            </h2>
          )}
          <OrganisationSelect />
        </div>
      );
    }

    return (
      <Switch>
        <Route path={settings.path} component={SettingsPage} />
        {orgId && <Redirect to={settings.getLink(orgId)} />}
      </Switch>
    );
  };

  return (
    <div className="sec-organisation">
      <Header />
      {renderContent()}
      <Popups />
    </div>
  );
};

export default OrganisationModule;
