import React, { FC } from 'react';
import classnames from 'classnames';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

import { Icon } from '../icon';

const styles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

export const NoData: FC<NoDataProps> = ({ className: providedClassName, label, align }) => (
  <div
    className={classnames('ox-no-data', providedClassName)}
    style={{ textAlign: align, justifyContent: align, ...styles }}
  >
    <Icon type="notes" marginRight={10} /> {label || 'No data found'}
  </div>
);

interface NoDataProps {
  label?: string;
  className?: string;
  align?: CSSProperties['textAlign'];
}
