import React, { FC, ReactNode, useCallback, useState } from 'react';

import { resolveError } from 'api/utils';
import { notifications } from 'utils/notifications';

import { Modal, ModalProps } from '../../modal/Modal';

export const Prompt: FC<PromptProps> = ({ delay, message, onConfirm, ...rest }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleConfirm = useCallback(async () => {
    try {
      setIsLoading(true);
      if (onConfirm) {
        await onConfirm();
      }
    } catch (error) {
      notifications.error(resolveError(error));
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [onConfirm]);

  return (
    <Modal
      className="sec-prompt"
      width={500}
      style={{ transition: `opacity ${delay}ms, visibility ${delay}ms` }}
      loading={isLoading}
      onConfirm={handleConfirm}
      initiallyOpen
      {...rest}
    >
      {message && <div className="prompt-message">{message}</div>}
    </Modal>
  );
};

export interface PromptProps extends ModalProps {
  message?: ReactNode;
  id?: string;
  type?: string;
  delay?: number;
}
