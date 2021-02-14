import React, { Fragment, memo, useCallback } from 'react';
import {
  Form as FinalForm,
  FormProps as FinalFormProps,
  UseFormStateParams,
  UseFieldConfig,
  useFormState,
  useField,
} from 'react-final-form';
import { FormApi } from 'final-form';
import classnames from 'classnames';

import { Message, Spinner } from 'components/common';
import { unavailFuncTitle } from 'app-constants';
import { resolveError } from 'api/utils';

import { Button, ButtonProps } from '../../common/button';

export const defaultFormSubscription: Subscription = {
  submitting: true,
  valid: true,
  invalid: true,
  touched: true,
  hasSubmitErrors: true,
  dirtySinceLastSubmit: true,
  submitFailed: true,
  error: true,
};

export const defaultFormSubscriptionWithValues: Subscription = {
  ...defaultFormSubscription,
  values: true,
};

const defaultSubmit = () => {};

const FormComponent = <DataType extends FormValueType>({
  children,
  render,
  subscription: providedSubscription,
  loading,
  className: passedClassName,
  contentClassName,
  buttonLabel,
  buttonPosition,
  buttonType,
  buttonWidth,
  displaySpinner,
  renderOutside,
  onSubmit = defaultSubmit,
  initialValues,
  unavailable,
  displayError,
  id,
  ...rest
}: FormProps<DataType>) => {
  const handleSubmit = useCallback(
    async (data: DataType, form: FormApi<DataType>) => {
      try {
        const response = await onSubmit(data, form);
        return response;
      } catch (rawError) {
        const error = resolveError(rawError);
        if (error.fieldErrors) {
          return error.fieldErrors;
        }

        throw rawError;
      }
    },
    [onSubmit],
  );
  const subscription =
    render || typeof children === 'function'
      ? defaultFormSubscriptionWithValues
      : defaultFormSubscription;
  const className = classnames(
    'sec-form',
    passedClassName,
    buttonPosition && `button-${buttonPosition}`,
  );

  return (
    <div className={className}>
      <FinalForm
        subscription={providedSubscription || subscription}
        initialValues={initialValues || undefined}
        onSubmit={handleSubmit}
        {...rest}
      >
        {renderProps => {
          const {
            invalid,
            hasSubmitErrors,
            dirtySinceLastSubmit,
            submitting,
            submitFailed,
            error,
          } = renderProps;
          const renderer = render || (typeof children === 'function' && children);

          return (
            <Fragment>
              <form onSubmit={renderProps.handleSubmit} id={id} noValidate>
                {displayError && (
                  <Message open={submitFailed && !!error} marginBottom={15} message={error} />
                )}

                <div className={classnames('form-content', contentClassName)}>
                  {renderer ? renderer(renderProps) : children}
                </div>

                {buttonLabel && (
                  <Button
                    className="submit-button"
                    disabled={invalid && !(hasSubmitErrors && dirtySinceLastSubmit)}
                    loading={submitting}
                    type={buttonType}
                    width={buttonWidth}
                    onClick={() => {
                      if (buttonType === 'button') {
                        renderProps.form.submit();
                      }
                    }}
                    {...(unavailable && { submitDisabled: true, title: unavailFuncTitle })}
                  >
                    {buttonLabel}
                  </Button>
                )}

                {(loading || (displaySpinner && submitting)) && <Spinner />}
              </form>

              {renderOutside && renderOutside(renderProps)}
            </Fragment>
          );
        }}
      </FinalForm>
    </div>
  );
};

export const Form = memo(FormComponent) as typeof FormComponent;

const useFormValuesParams: UseFormStateParams<any> = {
  subscription: { values: true },
};
const useFieldValueParams: UseFieldConfig<any> = {
  subscription: { value: true },
};
export const useFormValues = <FormValues extends FormValueType>(params = useFormValuesParams) =>
  useFormState<FormValues>(params);
export const useFieldValue = <FormValues extends FormValueType, ValueType = any>(
  name: keyof FormValues,
  params = useFieldValueParams,
) => useField(name as string, params).input.value as ValueType;

export { useForm } from 'react-final-form';

type Subscription = FinalFormProps['subscription'];
type FormValueType = Record<string, any>;
type FFormProps<DataType> = Omit<FinalFormProps<DataType>, 'onSubmit' | 'initialValues'>;
export interface FormProps<DataType = FormValueType> extends FFormProps<DataType> {
  loading?: boolean;
  className?: string;
  contentClassName?: string;
  buttonLabel?: string;
  buttonPosition?: 'right' | 'center';
  buttonType?: ButtonProps['type'];
  buttonWidth?: ButtonProps['width'];
  displaySpinner?: boolean;
  renderOutside?: FinalFormProps<DataType>['render'];
  onSubmit?: FinalFormProps<DataType>['onSubmit'];
  initialValues?: FinalFormProps<DataType>['initialValues'] | null;
  unavailable?: boolean;
  displayError?: boolean;
  id?: string;
}
