import React, { FC } from 'react';
import MatTooltip, { TooltipProps as MatTooltipProps } from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import { PalleteColor, resolvePalleteColor, resolvePalleteContrastColor } from 'theme';

export const Tooltip: FC<TooltipProps> = ({
  className: providedClassName,
  children,
  color = 'dark',
  fontSize = 12,
  padding = 10,
  ...rest
}) => {
  const backgroundColor = resolvePalleteColor(color);
  const contrastColor = resolvePalleteContrastColor(color);
  const classes = makeStyles(() => ({
    tooltip: {
      background: backgroundColor,
      color: contrastColor,
      padding: `${padding}px`,
      fontSize,
    },
    arrow: {
      color: backgroundColor,
      '&:before': {
        borderBottomRightRadius: '4px',
      },
    },
  }))();
  const className = classnames('sec-with-tooltip', providedClassName);

  return (
    <MatTooltip
      className={className}
      classes={classes}
      enterTouchDelay={50}
      placement="top"
      arrow
      {...rest}
    >
      {typeof children === 'string' ? (
        <span className="tooltip-link">{children}</span>
      ) : (
        (children as any)
      )}
    </MatTooltip>
  );
};

export interface TooltipProps extends Omit<MatTooltipProps, 'children'> {
  color?: PalleteColor;
  fontSize?: number;
  padding?: number;
}
