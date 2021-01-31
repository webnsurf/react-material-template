import React, {
  Fragment,
  ReactNode,
  useCallback,
  useMemo,
  MouseEvent,
  forwardRef,
  FC,
} from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import MatButton, { ButtonProps as MatButtonProps } from '@material-ui/core/Button';

import { getRandomId } from 'utils/general';
import { unavailFuncTitle } from 'app-constants';

import { Unavailable } from '../unavailable';
import { IconType, Icon, IconProps } from '../icon';
import { Spinner } from '../spinner';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className: passedClassName,
      disabled,
      loading,
      text,
      variant = text ? 'text' : 'contained',
      simple,
      color = simple ? 'default' : 'primary',
      type,
      icon,
      endIcon,
      iconColor,
      width,
      size = 'large',
      height,
      iconSize,
      label,
      link,
      simpleLink,
      htmlDisabled,
      onClick,
      forceOnClick,
      unavailable,
      title: providedTitle,
      unavailableTitle,
      unavailableTooltipWidth,
      ...rest
    },
    ref,
  ) => {
    const className = classnames(
      'sec-button',
      (disabled || htmlDisabled || unavailable) && 'disabled Mui-disabled',
      loading && 'loading',
      simple && 'simple',
      unavailable && 'unavailable',
      simpleLink && 'simple-link',
      text && 'text',
      passedClassName,
    );

    const startIcons = useMemo(() => {
      const icons: FC[] = [];

      if (loading) {
        icons.push(() => (
          <Spinner
            className="loading"
            type="transparent"
            color={iconColor || '#fff'}
            size={20}
            simple
          />
        ));
      }

      if (icon) {
        icons.push(() => <Icon type={icon} size={iconSize} color={iconColor} />);
      }

      if (!icons.length) {
        return null;
      }

      return (
        <Fragment>
          {icons.map(Item => (
            <Item key={getRandomId()} />
          ))}
        </Fragment>
      );
    }, [loading, icon, iconSize, iconColor]);

    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        if (forceOnClick) {
          forceOnClick(event);
        }

        if (htmlDisabled || unavailable) {
          event.preventDefault();
          return false;
        }

        if (onClick) {
          onClick(event);
        }
      },
      [htmlDisabled, unavailable, forceOnClick, onClick],
    );

    const title = unavailable ? unavailFuncTitle : providedTitle;

    const renderContent = () => {
      if (simpleLink) {
        return (
          <button
            className={className}
            type={type || 'button'} // eslint-disable-line react/button-has-type
            onClick={handleClick}
            title={!unavailable ? title : undefined}
            ref={ref}
            {...rest}
          >
            {label || children}
          </button>
        );
      }

      return (
        <MatButton
          className={className}
          variant={variant}
          color={color}
          startIcon={startIcons}
          endIcon={endIcon && <Icon type={endIcon} size={iconSize} color={iconColor} />}
          type={type || 'submit'}
          style={{ width, height }}
          disabled={htmlDisabled}
          onClick={handleClick}
          title={!unavailable ? title : undefined}
          size={size}
          ref={ref}
          {...rest}
          {...(link && { component: Link, to: link })}
        >
          {label || children}
        </MatButton>
      );
    };

    return (
      <Unavailable active={!!unavailable} title={unavailableTitle} width={unavailableTooltipWidth}>
        {renderContent()}
      </Unavailable>
    );
  },
);

export interface ButtonProps extends MatButtonProps {
  loading?: boolean;
  icon?: IconType;
  endIcon?: IconType;
  iconColor?: IconProps['color'];
  width?: number | string;
  height?: number | string;
  iconSize?: number;
  label?: ReactNode;
  simple?: boolean;
  simpleLink?: boolean;
  link?: string;
  htmlDisabled?: boolean;
  unavailable?: boolean;
  unavailableTitle?: ReactNode;
  unavailableTooltipWidth?: number;
  forceOnClick?: MatButtonProps['onClick'];
  text?: boolean;
}
