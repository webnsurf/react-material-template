import React, { ButtonHTMLAttributes, forwardRef, MouseEvent, ReactNode, useCallback } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import MatButton, { ButtonProps as MatButtonProps } from '@material-ui/core/Button';

import { PalleteColor, resolvePalleteColor } from 'theme';

import { Unavailable } from '../unavailable';
import { Icon, IconProps } from '../icon';

export const IconButton = forwardRef<HTMLAnchorElement, IconButtonProps>(
  (
    {
      className: providedClassName,
      buttonType = 'button',
      onClick,
      forceClick,
      label,
      buttonSize,
      disabled,
      color = 'primary',
      colorHex,
      background,
      backgroundHex,
      border,
      round,
      title,
      type,
      size,
      unavailable,
      link,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || unavailable;
    const mainColor = resolvePalleteColor(isDisabled ? 'disabled' : color);
    const mainBackground = background && resolvePalleteColor(background);
    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        if (forceClick) {
          forceClick(event);
        }

        if (isDisabled) {
          event.preventDefault();
          return false;
        }

        if (onClick) {
          onClick(event);
        }
      },
      [isDisabled, forceClick, onClick],
    );
    const renderButton = (className?: string) => (
      <MatButton
        className={className}
        onClick={handleClick}
        type={buttonType}
        title={!unavailable ? title : undefined}
        disabled={disabled}
        ref={ref as any}
        style={{
          color: colorHex || mainColor,
          background: backgroundHex || mainBackground,
          width: buttonSize,
          height: buttonSize,
        }}
        {...(link && {
          component: Link,
          to: link,
        })}
        {...rest}
      >
        <Icon
          type={type}
          color={isDisabled ? 'disabled' : color}
          colorHex={colorHex}
          size={size}
          style={{
            ...(border && { border: `1px solid ${colorHex || mainColor}` }),
            ...(round && { borderRadius: '50%' }),
          }}
        />
      </MatButton>
    );

    const className = classnames('sec-icon-button', isDisabled && 'disabled', providedClassName);

    const renderContent = () => {
      if (label) {
        return (
          <label
            className={className}
            style={{ color: mainColor }}
            title={!unavailable ? title : undefined}
          >
            {renderButton()}
            <span className="label">{label}</span>
          </label>
        );
      }

      return renderButton(className);
    };

    return <Unavailable active={!!unavailable}>{renderContent()}</Unavailable>;
  },
);

export interface IconButtonProps extends Omit<MatButtonProps, 'color' | 'size' | 'type'> {
  type: IconProps['type'];
  label?: ReactNode;
  border?: boolean;
  round?: boolean;
  buttonType?: ButtonHTMLAttributes<any>['type'];
  buttonSize?: number;
  title?: string;
  color?: PalleteColor;
  background?: PalleteColor;
  colorHex?: string;
  backgroundHex?: string;
  size?: IconProps['size'];
  unavailable?: boolean;
  forceClick?: MatButtonProps['onClick'];
  link?: string;
}
