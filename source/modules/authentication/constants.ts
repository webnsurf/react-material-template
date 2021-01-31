import { AuthPageKey, createAuthLink } from 'utils/router';

export const AUTH_PAGES: AuthPages = {
  [AuthPageKey.login]: {
    path: createAuthLink('login'),
    buttonLabel: 'Login',
  },
  [AuthPageKey.register]: {
    path: createAuthLink('register'),
    buttonLabel: 'Register',
  },
};

interface AuthPage {
  path: string;
  buttonLabel: string;
}

type AuthPages = {
  [key in AuthPageKey]: AuthPage;
};
