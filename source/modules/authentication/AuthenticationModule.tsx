import React, { FunctionComponent } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { AUTH_PAGES } from './constants';
import { LoginPage, RegisterPage } from './pages';

const { login, register } = AUTH_PAGES;

const AuthenticationModule: FunctionComponent = () => (
  <Switch>
    <Route path={login.path} component={LoginPage} />
    <Route path={register.path} component={RegisterPage} />

    <Route render={() => <Redirect to="/login" />} />
  </Switch>
);

export default AuthenticationModule;
