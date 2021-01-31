import React, { ReactNode, useCallback } from 'react';
import { Form as FinalForm, FormProps as FinalFormProps } from 'react-final-form';
import { FormSubscription, AnyObject } from 'final-form';
import createDecorator from 'final-form-focus';
import classnames from 'classnames';

import { notifications } from 'utils/notifications';
import { resolveError } from 'api/utils';

import { Modal, ModalProps } from '../../common/modal';
import { Button, ButtonProps } from '../../common/button';
import { Spinner } from '../../common';

const decorators = [createDecorator()];

const defaultSubmit = (): any => null;
const defaultSubscription: FormSubscription = {
  valid: true,
  invalid: true,
  dirtySinceLastSubmit: true,
  submitFailed: true,
  submitting: true,
  submitError: true,
  submitErrors: true,
};

const defaultSubscriptionWithValues: FormSubscription = {
  ...defaultSubscription,
  values: true,
};

export const Form = <T extends AnyObject>({
  id,
  onSubmit = defaultSubmit,
  onSuccess,
  className: passedClassName,
  contentClassName,
  children,
  subscription = children instanceof Function ? defaultSubscriptionWithValues : defaultSubscription,
  buttonLabel,
  buttonSize = 'large',
  buttonWidth,
  displaySpinner,
  initialValues,
  title,
  disabled,
  throwOnError,
  modalProps,
  modalHeading,
  ...rest
}: FormProps<T>) => {
  const handleSubmit: FinalFormProps<any>['onSubmit'] = useCallback(
    async (values, form) => {
      try {
        const response = await onSubmit(values, form);

        if (onSuccess) {
          onSuccess(response);
        }
      } catch (rawError) {
        const error = resolveError(rawError);

        if (error.fieldErrors) {
          return error.fieldErrors;
        }

        if (throwOnError) {
          throw error;
        }

        notifications.error(error);
      }
    },
    [onSubmit, onSuccess, throwOnError],
  );

  const form = (
    <FinalForm<T>
      onSubmit={handleSubmit}
      subscription={subscription}
      decorators={decorators as any}
      initialValues={initialValues}
      {...rest}
    >
      {renderProps => {
        const { submitting, invalid, submitFailed, dirtySinceLastSubmit } = renderProps;

        const innerContent = children instanceof Function ? children(renderProps) : children;

        const className = classnames(
          'sec-form',
          submitting && 'submitting',
          displaySpinner && 'with-spinner',
          passedClassName,
        );

        return (
          <form
            id={id}
            onSubmit={renderProps.handleSubmit}
            className={className}
            title={title}
            noValidate
          >
            <div className={classnames('inner-content', contentClassName)}>
              {innerContent}
              {buttonLabel && (
                <div className="submit-button">
                  <Button
                    type="submit"
                    disabled={invalid && (!submitFailed || !dirtySinceLastSubmit)}
                    loading={submitting}
                    size={buttonSize}
                    width={buttonWidth}
                    htmlDisabled={disabled}
                  >
                    {buttonLabel}
                  </Button>
                </div>
              )}
            </div>

            {displaySpinner && <Spinner visible={submitting} />}
          </form>
        );
      }}
    </FinalForm>
  );

  if (modalProps || modalHeading) {
    return (
      <Modal heading={modalHeading} {...modalProps}>
        {form}
      </Modal>
    );
  }

  return form;
};

export interface FormProps<T = any> extends Omit<FinalFormProps<T>, 'onSubmit'> {
  id?: string;
  className?: string;
  contentClassName?: string;
  buttonLabel?: ReactNode;
  buttonSize?: ButtonProps['size'];
  buttonWidth?: ButtonProps['width'];
  displaySpinner?: boolean;
  onSubmit?: FinalFormProps<T>['onSubmit'];
  onSuccess?: (response: any) => any;
  title?: string;
  disabled?: boolean;
  throwOnError?: boolean;
  modalProps?: ModalProps;
  modalHeading?: ModalProps['heading'];
  initialValues?: T;
}
