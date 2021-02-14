import React, { FC, MouseEvent, ReactNode, useCallback } from 'react';
import {
  Link as RouterLink,
  NavLink as RouterNavLink,
  NavLinkProps as RouterLinkProps,
} from 'react-router-dom';
import classnames from 'classnames';
import validator from 'validator';

import { resolvePalleteColor, PalleteColor } from 'theme';

import { Unavailable } from '../unavailable';

export const Link: FC<LinkProps> = ({
  className: providedClassName,
  title: providedTitle,
  to,
  blank,
  children,
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
  const LinkComponent = rest.activeClassName ? RouterNavLink : RouterLink;
  const title = !unavailable ? providedTitle : undefined;
  const content =
    blank || isEmail ? (
      <a
        className={className}
        href={`${isEmail ? 'mailto:' : ''}${href}`}
        onClick={handleClick}
        title={title ? String(title) : undefined}
        target="_blank"
        rel="noreferrer"
        style={style}
      >
        {children || href}
      </a>
    ) : (
      <LinkComponent
        className={className}
        onClick={handleClick}
        title={title ? String(title) : undefined}
        style={style}
        to={href}
        {...rest}
      >
        {children || href}
      </LinkComponent>
    );

  return (
    <Unavailable active={!!unavailable} title={providedTitle}>
      {content}
    </Unavailable>
  );
};
export interface LinkProps extends Omit<RouterLinkProps, 'title'> {
  blank?: boolean;
  disabled?: boolean;
  unavailable?: boolean;
  title?: ReactNode;
  color?: PalleteColor;
  forceOnClick?: RouterLinkProps['onClick'];
}
