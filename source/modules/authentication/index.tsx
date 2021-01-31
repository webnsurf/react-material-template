import React, { FC, Suspense } from 'react';

import { Spinner } from 'components/common';

const LazyAuthenticationModule = React.lazy(
  () => import(/* webpackChunkName: "authentication" */ './AuthenticationModule'),
);

export const AuthenticationModule: FC = () => (
  <Suspense fallback={<Spinner type="dark" />}>
    <LazyAuthenticationModule />
  </Suspense>
);
