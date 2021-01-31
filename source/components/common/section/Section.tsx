import React, { FC, ReactNode } from 'react';
import classnames from 'classnames';
import { AppBar } from '@material-ui/core';

import { Spinner } from '../spinner/Spinner';

export const Section: FC<SectionProps> = ({ className, heading, isLoading = false, children }) => {
  const classNames = classnames('sec-section', className);

  return (
    <div className={classNames}>
      {heading && (
        <AppBar className="section-heading" position="relative">
          {heading}
        </AppBar>
      )}

      <div className="content">{children}</div>

      <Spinner visible={isLoading} iconSize={50} />
    </div>
  );
};

interface SectionProps {
  className?: string;
  heading?: ReactNode;
  isLoading?: boolean;
}
