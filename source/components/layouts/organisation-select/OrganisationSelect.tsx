import React, { FC, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Paper, Button as MUButton } from '@material-ui/core';
import classnames from 'classnames';

import { useOrganisationConfigModal } from 'components/popups/organisation-config';
import { getNewOrganisationUrl } from 'utils/router';
import { useOrganisationsList } from 'store/organisation';

import { Button } from '../../common';

export const OrganisationSelect: FC<OrganisationSelectProps> = ({
  className: providedClassName,
}) => {
  const organisations = useOrganisationsList();
  const orhanisationConfig = useOrganisationConfigModal();

  return (
    <div className={classnames('sec-organisation-select', providedClassName)}>
      {organisations.length ? (
        <div className="select-wrapper">
          <h1>Please select one of the organisations from the list below</h1>

          <div className="select-list">
            {organisations.map(({ id, name, url }) => (
              <Link to={getNewOrganisationUrl(id)} key={id} className="link">
                <Paper className="card" title={`${name} | ${id}`}>
                  <MUButton>
                    <div className="content">
                      <div className="name">{name}</div>
                      {url && <div className="url">{url}</div>}
                    </div>
                  </MUButton>
                </Paper>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <Fragment>
          <h1>You're not part of any organisation</h1>
          <h3>Would you like to create one?</h3>
        </Fragment>
      )}

      <Button onClick={orhanisationConfig.new} size="large">
        Create Organisation
      </Button>
    </div>
  );
};

interface OrganisationSelectProps {
  className?: string;
}
