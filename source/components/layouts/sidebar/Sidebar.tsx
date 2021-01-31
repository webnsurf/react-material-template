import React, { FC } from 'react';
import classnames from 'classnames';
import { Button } from '@material-ui/core';

import { Chevron } from 'components/common';
import { useIsSidebarOpen, useSidebarActions } from 'store/settings';

export const Sidebar: FC<SidebarProps> = ({ className, partial, children }) => {
  const sidebarActions = useSidebarActions();
  const isOpen = useIsSidebarOpen();

  const classNames = classnames(
    'sec-sidebar',
    isOpen ? 'open' : 'closed',
    partial && 'partial',
    className,
  );

  return (
    <div className={classNames}>
      <div className="inner">
        {children}

        <Button className="toggle" onClick={() => sidebarActions.toggle()}>
          <Chevron dir={isOpen ? 'left' : 'right'} className="chevron" size={30} />
        </Button>
      </div>
    </div>
  );
};

type SidebarProps = {
  className?: string;
  partial?: boolean;
};
