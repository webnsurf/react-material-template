export const getCurrentPathname = () => window.location.pathname.replace(/\/$/, '');

type RouteArgument = string | null | undefined;
export const createRoutePath = (...args: RouteArgument[]) =>
  args.filter(arg => arg !== null && arg !== undefined).join('/');

export const getNewOrganisationUrl = (orgId: string) =>
  window.location.pathname.replace(/^\/([a-zA-Z0-9]+\/)?(.*)$/, `/${orgId}/$2`);

// Authentication
export enum AuthPageKey {
  login = 'login',
  register = 'register',
}

export const createAuthLink = (...path: RouteArgument[]) => createRoutePath('', ...path);

export const checkIsAuthPage = () =>
  [AuthPageKey.login, AuthPageKey.register].includes(
    getCurrentPathname().substring(1) as AuthPageKey,
  );

// Organisation
export enum OrganisationPageKey {
  settings = 'settings',
}

export const createOrganisationPath = (...path: RouteArgument[]) =>
  createRoutePath('/:orgId', ...path);

export const createOrganisationLink = (orgId: string, ...path: RouteArgument[]) =>
  createRoutePath(`/${orgId}`, ...path);

// Organisation Settings
export enum SettingsTabKey {
  users = 'users',
}

export const createSettingsPath = (...path: RouteArgument[]) =>
  createOrganisationPath(OrganisationPageKey.settings, ...path);

export const createSettingsLink = (orgId: string, ...path: RouteArgument[]) =>
  createOrganisationLink(orgId, OrganisationPageKey.settings, ...path);
