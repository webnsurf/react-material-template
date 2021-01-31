import React, { FC } from 'react';
import classnames from 'classnames';
import AntPopconfirm, { PopconfirmProps as AntPopconfirmProps } from 'antd/lib/popconfirm';
import 'antd/lib/popconfirm/style';

export const Popconfirm: FC<PopconfirmProps> = ({
  className: providedClassName,
  disableButtons,
  ...rest
}) => {
  const className = classnames('sec-popconfirm', disableButtons && 'no-buttons', providedClassName);
  return (
    <AntPopconfirm
      overlayClassName={className}
      {...(disableButtons && {
        okButtonProps: { hidden: true },
        cancelButtonProps: { hidden: true },
      })}
      {...rest}
    />
  );
};

interface PopconfirmProps extends AntPopconfirmProps {
  disableButtons?: boolean;
}
