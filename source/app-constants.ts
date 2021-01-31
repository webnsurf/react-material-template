export const environment = (() => {
  const { host } = window.location;

  if (/^(localhost:|nestjs\.dev\.webnsurf\.com)/.test(host)) {
    return 'development';
  }

  if (/^nestjs\.local\.webnsurf\.com/.test(host)) {
    return 'local';
  }

  if (/^nestjs\.staging\.webnsurf\.com/.test(host)) {
    return 'staging';
  }

  return 'production';
})();

export const isDevelopment = environment === 'development';
export const isLocal = environment === 'local';
export const isStaging = environment === 'staging';
export const isProduction = environment === 'production';

export const API_PREFIX = '/api';
export const STORAGE_PREFIX = 'sce-';
export const APP_SETTINGS_KEY = `${STORAGE_PREFIX}appSettings`;

export const AUTHENTICATED_COOKIE_KEY = 'webnsurf-nestjs-authenticated';

export const LAST_URL_KEY = `${STORAGE_PREFIX}last-url`;

export const unavailFuncTitle = 'Currentrly unavailable';
