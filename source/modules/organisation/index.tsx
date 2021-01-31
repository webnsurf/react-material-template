import React, { FC, Suspense } from 'react';

import { Spinner } from 'components/common';

const LazyOrganisationModule = React.lazy(
  () => import(/* webpackChunkName: "organisation" */ './OrganisationModule'),
);

export const OrganisationModule: FC = () => (
  <Suspense fallback={<Spinner type="dark" />}>
    <LazyOrganisationModule />
  </Suspense>
);
