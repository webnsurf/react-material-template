import React, { FC, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import { store } from 'store';
import { useIsAuthenticating, useIsLoggedIn, useAuthenticate } from 'store/user';
import { isDevelopment } from 'app-constants';
import { theme } from 'theme';
import { Spinner, PopupsContainer } from 'components/common';
import { AuthenticationModule } from 'modules/authentication';
import { OrganisationModule } from 'modules/organisation';
import { useIsDataTreeLoading, useLoadDataTree } from 'store/data-tree';
import { useIsAccessControlLoading, useLoadAccessControl } from 'store/access-control';

const mod: any = module;

if (isDevelopment && mod.hot) {
  mod.hot.accept();
}

export const App: FC = () => {
  const authenticate = useAuthenticate();
  const loadDataTree = useLoadDataTree();
  const loadAccessControl = useLoadAccessControl();
  const isAuthenticating = useIsAuthenticating();
  const isLoggedIn = useIsLoggedIn();
  const isDataTreeLoading = useIsDataTreeLoading();
  const isAccessControlLoading = useIsAccessControlLoading();

  useEffect(() => {
    authenticate().then(user => {
      if (user) {
        loadDataTree();
        loadAccessControl();
      }
    });
  }, [authenticate, loadDataTree, loadAccessControl]);

  const renderContent = () => {
    if (isAuthenticating || isDataTreeLoading || isAccessControlLoading) {
      return <Spinner type="dark" />;
    }

    if (isLoggedIn) {
      return <Route path="/:orgId?" component={OrganisationModule} />;
    }

    return <Route path="/" component={AuthenticationModule} />;
  };

  return (
    <div className="sec-app">
      {renderContent()}
      <CssBaseline />
      <PopupsContainer />
    </div>
  );
};

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </MuiThemeProvider>,
  document.getElementById('root'),
);
