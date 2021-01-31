import React, { FC, CSSProperties } from 'react';
import classnames from 'classnames';

import { SvgIconTypeMap } from '@material-ui/core/SvgIcon';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Add from '@material-ui/icons/Add';
import Close from '@material-ui/icons/Close';
import Cancel from '@material-ui/icons/Cancel';
import Check from '@material-ui/icons/Check';
import CheckCircle from '@material-ui/icons/CheckCircle';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import MeetingRoom from '@material-ui/icons/MeetingRoom';
import Equalizer from '@material-ui/icons/Equalizer';
import Settings from '@material-ui/icons/Settings';
import FormatListBulleted from '@material-ui/icons/FormatListBulleted';
import Code from '@material-ui/icons/Code';
import SupervisorAccount from '@material-ui/icons/SupervisorAccount';
import FileCopy from '@material-ui/icons/FileCopy';
import Delete from '@material-ui/icons/Delete';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';

import { PalleteColor, resolvePalleteColor, resolvePalleteContrastColor } from 'theme';

const icons = {
  chevronDown: KeyboardArrowDown,
  chevronRight: KeyboardArrowRight,
  add: Add,
  cancel: Close,
  cancelCircle: Cancel,
  check: Check,
  checkCircle: CheckCircle,
  books: LibraryBooks,
  meetingRoom: MeetingRoom,
  eualizer: Equalizer,
  settings: Settings,
  list: FormatListBulleted,
  code: Code,
  account: SupervisorAccount,
  copy: FileCopy,
  delete: Delete,
  eye: VisibilityOutlinedIcon,
  eyeSlash: VisibilityOffOutlinedIcon,
  home: HomeOutlinedIcon,
};

export const Icon: FC<IconProps> = ({
  className: providedClassName,
  type,
  size,
  marginLeft,
  marginRight,
  style,
  round,
  background,
  padding,
  strokeWidth,
  strokeLinejoin,
  color,
  colorHex,
  ...rest
}) => {
  const Element = type in icons ? icons[type] : (props: any) => <div {...props}>{type}</div>;
  const className = classnames('sec-icon', providedClassName);

  return (
    <Element
      className={className}
      style={{
        color: colorHex || resolvePalleteColor(color),
        ...(background && {
          background: resolvePalleteColor(background),
          color: resolvePalleteContrastColor(background),
        }),
        borderRadius: round ? '50%' : undefined,
        fontSize: size,
        marginLeft,
        marginRight,
        strokeWidth,
        strokeLinejoin,
        padding,
        ...style,
      }}
      {...rest}
    />
  );
};

type MatIconProps = SvgIconTypeMap<Record<string, unknown>, 'svg'>['props'];
export interface IconProps extends Omit<MatIconProps, 'color'> {
  type: IconType;
  className?: string;
  size?: number;
  marginLeft?: number;
  marginRight?: number;
  style?: CSSProperties;
  background?: PalleteColor;
  color?: PalleteColor;
  round?: boolean;
  padding?: number;
  strokeWidth?: CSSProperties['strokeWidth'];
  strokeLinejoin?: CSSProperties['strokeLinejoin'];
  colorHex?: string;
}
export type IconType = keyof typeof icons;

export const iconKeys = Object.keys(icons) as IconType[];
