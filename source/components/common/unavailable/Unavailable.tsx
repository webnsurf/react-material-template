import React, { FC, Fragment, ReactNode } from 'react';

import { Tooltip, TooltipProps } from '../tooltip/Tooltip';
import { Link } from '../link/Link';

export const EmailLink = () => <Link to="support@webnsurf.com" color="tertiary" />;

export const Unavailable: FC<UnavailableProps> = ({ active = true, title, width, ...rest }) => {
  if (active) {
    return (
      <Tooltip
        interactive
        title={
          <div className="ox-unavailable-title" style={{ maxWidth: width }}>
            {title || (
              <Fragment>
                To enable this feature contact customer support at <EmailLink />
              </Fragment>
            )}
          </div>
        }
        {...rest}
      />
    );
  }

  return <Fragment {...rest} />;
};

interface UnavailableProps extends Omit<TooltipProps, 'title'> {
  title?: ReactNode;
  active?: boolean;
  width?: number;
}
