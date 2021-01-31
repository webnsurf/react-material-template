import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

import { Icon } from '../icon/Icon';

export const Chevron: FunctionComponent<ChevronProps> = ({ dir = 'down', className, size }) => {
  const classNames = classnames('sec-chevron', className, dir);
  const chevronType = /left|right/.test(dir) ? 'chevronRight' : 'chevronDown';

  return (
    <div className={classNames} style={size ? { width: size, height: size } : {}}>
      <Icon type={chevronType} />
    </div>
  );
};

interface ChevronProps {
  dir?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  size?: number;
}
