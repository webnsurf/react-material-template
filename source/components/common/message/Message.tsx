import React, { useEffect, useState, FC, useCallback, ReactNode } from 'react';
import classnames from 'classnames';
import Alert, { AlertProps } from '@material-ui/lab/Alert';

import { useElementResizeObserver } from 'hooks/resize';
import { theme } from 'theme';

export const Message: FC<MessageProps> = ({
  message,
  open = true,
  className: passedClassName,
  type = 'error',
  marginTop = 0,
  marginBottom = 0,
  simple,
  ...rest
}) => {
  const [displayedNode, setDisplayedNode] = useState(message);
  const [nodeRef, messageHeight = 0] = useElementResizeObserver(
    useCallback(({ contentRect }) => contentRect.height + marginTop + marginBottom, [
      marginTop,
      marginBottom,
    ]),
  );

  useEffect(() => {
    if (message && displayedNode !== message) {
      setDisplayedNode(message);
    }
  }, [displayedNode, message]);

  const classNames = classnames(
    'sec-message',
    open ? 'open' : 'closed',
    simple && 'simple',
    passedClassName,
    type,
  );

  return (
    <div className={classNames} style={{ height: open ? messageHeight : 0 }}>
      <div
        className="inner"
        ref={nodeRef}
        style={{
          color: theme.palette[type].main,
          ...(marginTop && { marginTop }),
          ...(marginBottom && { marginBottom }),
        }}
      >
        {simple ? (
          displayedNode
        ) : (
          <Alert severity={type} {...rest}>
            {displayedNode}
          </Alert>
        )}
      </div>
    </div>
  );
};

export interface MessageProps extends AlertProps {
  message?: ReactNode;
  open?: boolean;
  marginTop?: number;
  marginBottom?: number;
  simple?: boolean;
  type?: AlertProps['severity'];
}
