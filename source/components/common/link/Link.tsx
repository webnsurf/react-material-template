import React, { FC, MouseEvent, useCallback } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import classnames from 'classnames';
import validator from 'validator';

import { resolvePalleteColor, PalleteColor } from 'theme';

import { Unavailable } from '../unavailable/Unavailable';

export const Link: FC<LinkProps> = ({
  className: providedClassName,
  blank,
  children,
  to,
  disabled,
  unavailable,
  color,
  onClick,
  forceOnClick,
  ...rest
}) => {
  const className = classnames(
    'sec-link',
    (disabled || unavailable) && 'disabled',
    providedClassName,
  );
  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (forceOnClick) {
        forceOnClick(event);
      }
      if (disabled || unavailable) {
        event.preventDefault();
        return false;
      }

      if (onClick) {
        onClick(event);
      }
    },
    [disabled, unavailable, forceOnClick, onClick],
  );
  const href = String(to);
  const isEmail = validator.isEmail(href.split(/\?/)[0]);
  const style = color ? { color: resolvePalleteColor(color) } : undefined;
  const content =
    blank || isEmail ? (
      <a
        className={className}
        href={`${isEmail ? 'mailto:' : ''}${href}`}
        onClick={handleClick}
        target="_blank"
        rel="noreferrer"
        style={style}
      >
        {children || href}
      </a>
    ) : (
      <RouterLink className={className} onClick={handleClick} style={style} to={href} {...rest}>
        {children || href}
      </RouterLink>
    );

  return <Unavailable active={!!unavailable}>{content}</Unavailable>;
};
export interface LinkProps extends Omit<RouterLinkProps, 'title'> {
  blank?: boolean;
  disabled?: boolean;
  unavailable?: boolean;
  color?: PalleteColor;
  forceOnClick?: RouterLinkProps['onClick'];
}
