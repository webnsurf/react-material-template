import React, { FC, useState, useEffect, useMemo, Fragment } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { notifications as notificationsManager } from 'utils/notifications';
import { prompt as promptManager } from 'utils/prompt';

import { Notification, NotificationProps, defaultTimeouts } from './Notification';
import { Prompt, PromptProps } from './prompt/Prompt';

export const transitionDelays = {
  notification: 150,
  prompt: 150,
};

export const PopupsContainer: FC = () => {
  const [notificationsList, setNotificationsList] = useState<NotificationProps[]>([]);
  const [promptsList, setPromptsList] = useState<PromptProps[]>([]);

  const notificationsController = useMemo(
    () => ({
      show: (notification: NotificationProps) => {
        const { id, type, delay } = notification;

        if (id && type) {
          const defaultDelay = defaultTimeouts[type];

          setNotificationsList(oldList => [...oldList, notification]);
          setTimeout(() => notificationsController.hide(id), delay || defaultDelay);
        }
      },
      hide: (id?: string) => {
        setNotificationsList(oldList => {
          const notificationToHide = oldList.find(notification => notification.id === id);
          const notificationIndex = notificationToHide && oldList.indexOf(notificationToHide);

          if (notificationIndex !== undefined) {
            oldList.splice(notificationIndex, 1);
            return [...oldList];
          }

          return oldList;
        });
      },
    }),
    [],
  );

  const promptController = useMemo(
    () => ({
      show: (prompt: PromptProps) => setPromptsList(oldList => [...oldList, prompt]),
      hide: (id?: string) => {
        setPromptsList(oldList => {
          const promptToHide = oldList.find(prompt => prompt.id === id);
          const promptIndex = promptToHide && oldList.indexOf(promptToHide);

          if (promptIndex !== undefined) {
            oldList.splice(promptIndex, 1);
            return [...oldList];
          }

          return oldList;
        });
      },
    }),
    [],
  );

  useEffect(() => {
    notificationsManager.subscribe('change', notificationsController.show);
    return () => notificationsManager.unsubscribe('change', notificationsController.show);
  }, [notificationsController]);

  useEffect(() => {
    promptManager.subscribe('change', promptController.show);
    return () => promptManager.unsubscribe('change', promptController.show);
  }, [promptController]);

  return (
    <Fragment>
      <TransitionGroup className="sec-notifications-container">
        {notificationsList.map(notification => (
          <CSSTransition
            classNames="slide"
            key={notification.id}
            timeout={transitionDelays.notification}
          >
            <Notification
              onClose={() => notificationsController.hide(notification.id)}
              delay={transitionDelays.notification}
              {...notification}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>

      <TransitionGroup>
        {promptsList.map(prompt => (
          <CSSTransition classNames="fade" key={prompt.id} timeout={transitionDelays.prompt}>
            <Prompt
              onClose={() => promptController.hide(prompt.id)}
              delay={transitionDelays.prompt}
              {...prompt}
              onConfirm={async () => {
                if (prompt.onConfirm) {
                  await prompt.onConfirm();
                }
                promptController.hide(prompt.id);
              }}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </Fragment>
  );
};
