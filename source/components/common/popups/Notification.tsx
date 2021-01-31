import React, { FC } from 'react';

import { Message, MessageProps } from '../message/Message';

export const defaultTimeouts = {
  error: 5000,
  success: 3000,
  info: 3000,
  warning: 3000,
};

export const Notification: FC<NotificationProps> = ({ delay, ...rest }) => (
  <div className="sec-notification" style={{ transition: `left ${delay}ms` }}>
    <Message className="notification-content" {...rest} />
  </div>
);

export interface NotificationProps extends MessageProps {
  id?: string;
  delay?: number;
}
