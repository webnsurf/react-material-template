import { AUTHENTICATED_COOKIE_KEY, LAST_URL_KEY } from 'app-constants';

import { cookieStorage } from './cookie';
import { browserStorage } from './browser';

export const checkIsLoggedIn = () =>
  cookieStorage.get(AUTHENTICATED_COOKIE_KEY, { noPrefix: true });

export const getLastUrl = () => browserStorage.get(LAST_URL_KEY);
export const setLastUrl = (url: string) => browserStorage.set(LAST_URL_KEY, url);
export const removeLastUrl = () => browserStorage.remove(LAST_URL_KEY);
