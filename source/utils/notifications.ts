import { NotificationProps } from 'components/common/popups/Notification';

import { getRandomId, EventEmitter } from './general';

class NotificationsManager extends EventEmitter<NotificationProps> {
  error({ id, message }: NotificationProps) {
    this.emit('change', {
      id: id || getRandomId(),
      type: 'error',
      message,
    });
  }

  success({ id, message }: NotificationProps) {
    this.emit('change', {
      id: id || getRandomId(),
      type: 'success',
      message,
    });
  }
}

export const notifications = new NotificationsManager();
