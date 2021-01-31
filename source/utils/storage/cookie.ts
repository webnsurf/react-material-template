import Cookies from 'cookies-js';

import { STORAGE_PREFIX } from 'app-constants';

const defaultOptions: Options = {
  noPrefix: false,
  secure: true,
  path: '/',
};

export const cookieStorage = {
  get: (key: string, { noPrefix } = defaultOptions) => {
    const item = Cookies.get(`${noPrefix ? '' : STORAGE_PREFIX}${key}`);

    if (item) {
      try {
        return JSON.parse(item);
      } catch {}
    }

    return item || null;
  },
  set: (key: string, value: any, { noPrefix, ...options } = defaultOptions) => {
    let stringData = value;
    try {
      stringData = JSON.stringify(value);
    } catch {}

    return Cookies.set(`${noPrefix ? '' : STORAGE_PREFIX}${key}`, stringData, options);
  },
  remove: (key: string, { noPrefix, ...options } = defaultOptions) =>
    Cookies.expire(`${noPrefix ? '' : STORAGE_PREFIX}${key}`, options),
};

interface Options {
  noPrefix: boolean;
  path?: string;
  domain?: string;
  expires?: any;
  secure?: boolean;
}
