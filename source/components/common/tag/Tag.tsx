import React, { ComponentProps, ReactNode, useCallback } from 'react';
import classnames from 'classnames';

import { PalleteColor, resolvePalleteColor, resolvePalleteContrastColor } from 'theme';

import { IconButton } from '../button';

export const Tag = <DataType extends any>({
  className: providedClassName,
  color = 'input',
  size = 'medium',
  children,
  label,
  onRemove,
  render,
  value,
  round,
}: TagBaseProps | TagProps<DataType>) => {
  const displayValue = render ? render(value) : label || children;
  const removeTag = useCallback(() => onRemove(value), [onRemove, value]);
  const className = classnames('sec-tag', size, onRemove && 'removable', providedClassName);

  return (
    <div
      className={className}
      style={{
        background: resolvePalleteColor(color),
        color: resolvePalleteContrastColor(color),
        borderRadius: round ? 12 : undefined,
        minWidth: size,
        height: size,
      }}
    >
      {displayValue}

      {onRemove && (
        <IconButton
          className="remove-option-button"
          onClick={removeTag}
          title={`Remove ${displayValue}`}
          type="close"
          color="error"
          size={18}
        />
      )}
    </div>
  );
};

interface TagBaseProps extends ComponentProps<any> {
  color?: PalleteColor;
  label?: ReactNode;
  className?: string;
  size?: 'large' | 'medium' | 'small';
  round?: boolean;
}

export interface TagProps<DataType extends any = any> extends TagBaseProps {
  value: DataType;
  onRemove: (value: DataType) => any;
  render?: (value: DataType) => ReactNode;
}
