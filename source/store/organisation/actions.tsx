import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { organisationAPI } from 'api/organisation';
import { notifications } from 'utils/notifications';

import {
  Organisation,
  AfterSetOrganisationAction,
  AfterSetOrganisationsListAction,
  AfterCreateOrganisationAction,
  AfterResetOrganisationAction,
} from './types';

export const AFTER_SET_ORGANISATION = 'AFTER_SET_ORGANISATION';
export const AFTER_SET_ORGANISATIONS_LIST = 'AFTER_SET_ORGANISATIONS_LIST';
export const AFTER_CREATE_ORGANISATION = 'AFTER_CREATE_ORGANISATION';
export const AFTER_RESET = 'AFTER_RESET';

export const baseActions = {
  afterSetOrganisation: (organisation?: Organisation): AfterSetOrganisationAction => ({
    type: AFTER_SET_ORGANISATION,
    organisation,
  }),
  afterSetOrganisationsList: (organisations: Organisation[]): AfterSetOrganisationsListAction => ({
    type: AFTER_SET_ORGANISATIONS_LIST,
    organisations,
  }),
  afterCreateOrganisation: (organisation: Organisation): AfterCreateOrganisationAction => ({
    type: AFTER_CREATE_ORGANISATION,
    organisation,
  }),
  afterReset: (): AfterResetOrganisationAction => ({
    type: AFTER_RESET,
  }),
};

export const useSetOrganisation = (): typeof baseActions.afterSetOrganisation => {
  const dispatch = useDispatch();
  return useCallback(organisation => dispatch(baseActions.afterSetOrganisation(organisation)), [
    dispatch,
  ]);
};

export const useSetOrganisationList = (): typeof baseActions.afterSetOrganisationsList => {
  const dispatch = useDispatch();

  return useCallback(
    organisations => dispatch(baseActions.afterSetOrganisationsList(organisations)),
    [dispatch],
  );
};

export const useResetOrganisations = (): typeof baseActions.afterReset => {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(baseActions.afterReset()), [dispatch]);
};

export const useCreateOrganisation = (): typeof organisationAPI.create => {
  const dispatch = useDispatch();
  const history = useHistory();

  return useCallback(
    async data => {
      const organisation = await organisationAPI.create(data);
      dispatch(baseActions.afterCreateOrganisation(organisation));

      notifications.success({
        message: (
          <span>
            Organisation <b>{organisation.name}</b> created
          </span>
        ),
      });

      history.push(`/${organisation.id}`);

      return organisation;
    },
    [dispatch, history],
  );
};
