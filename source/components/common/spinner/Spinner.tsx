import React, { FC, CSSProperties } from 'react';
import classnames from 'classnames';

import { theme } from 'theme';

export const Spinner: FC<SpinnerProps> = ({
  visible = true,
  className: passedClassName,
  type = 'light',
  size,
  iconSize = 100,
  simple,
  color,
}) => {
  const className = classnames('sec-spinner', visible && 'visible', passedClassName);

  const style: CSSProperties = {
    ...(type !== 'transparent' && {
      background: `rgba(${type === 'light' ? '255,255,255' : '150,150,150'}, 0.7)`,
    }),
    ...(size && { width: size, height: size }),
    ...(simple && { position: 'relative' }),
  };

  const paletteColor = color && (theme.palette as any)[color];
  const resolvedColor = paletteColor?.main || paletteColor?.primary || paletteColor?.active;

  return (
    <div className={className} style={style}>
      <svg viewBox="0 0 50 50" style={{ width: iconSize, height: iconSize }}>
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke={resolvedColor || color || theme.palette.primary.main}
        />
      </svg>
    </div>
  );
};

interface SpinnerProps {
  visible?: boolean;
  simple?: boolean;
  className?: string;
  type?: 'light' | 'dark' | 'transparent';
  size?: number;
  iconSize?: number;
  color?: string;
}
