import { ReactNode, useMemo } from 'react';
import validator from 'validator';

const isEmpty = (value?: any) => {
  switch (typeof value) {
    case 'string': {
      return !value.trim();
    }
    case 'number':
    case 'boolean': {
      return value === undefined && value === null;
    }
    case 'object': {
      return !value?.length;
    }
    default:
      return true;
  }
};

export const useFieldValidation = <ValueType extends any>(
  {
    validatePassword,
    errorMessage,
    inputType,
    minLength,
    maxLength,
    required,
    label,
    min,
    max,
  }: Options,
  initialValidators?: FieldValidator<ValueType>[],
) =>
  useMemo(() => {
    let validators: FieldValidator<ValueType>[] = [];

    if (required) {
      validators.push(rawValue => {
        if (inputType === 'checkbox') {
          if (!rawValue) {
            return errorMessage || 'Please select the option above';
          }
        } else if (isEmpty(rawValue)) {
          if (inputType === 'checkbox-list') {
            return errorMessage || 'Please select one of the options above';
          }

          return errorMessage || `${label || 'Field'} is required`;
        }
      });
    }

    if (validatePassword) {
      validators.push(rawValue => {
        const password = rawValue as string;

        if (password.length < 8) {
          return 'Password must be at least 8 characters long';
        }

        if (!/[0-9]/.test(password)) {
          return 'Password must contain at least one number';
        }

        if (!/[a-z]/.test(password)) {
          return 'Password must contain at least one lower case letter';
        }

        if (!/[A-Z]/.test(password)) {
          return 'Password must contain at least one upper case letter';
        }
      });
    }

    if (inputType === 'email') {
      validators.push(rawValue => {
        // If inputType === 'email' we know the type of the rawValue will always be string
        const value = String(rawValue || '');

        if ((value || required) && !validator.isEmail(value)) {
          return errorMessage || 'Email address is in a wrong format';
        }
      });
    }

    if (inputType && ['number', 'tel'].includes(inputType)) {
      if (min !== undefined) {
        validators.push(rawValue => {
          // If inputType is 'number' || 'tel' we know the type of the rawValue will always be number
          const value = Number(rawValue);

          if (value < min) {
            return errorMessage || `Minimum value for ${label || 'Field'} is ${min}`;
          }
        });
      }

      if (max !== undefined) {
        validators.push(rawValue => {
          // If inputType is 'number' || 'tel' we know the type of the rawValue will always be number
          const value = Number(rawValue);

          if (value > max) {
            return errorMessage || `Maximum value for ${label || 'Field'} is ${max}`;
          }
        });
      }
    }

    if (minLength) {
      validators.push(rawValue => {
        // If minLength is provided we know the type of the rawValue will always be string
        const value = rawValue as string;

        if (isEmpty(value) || value.length < minLength) {
          return (
            errorMessage || `${label || 'Field'} must be at least ${minLength} charactest long`
          );
        }
      });
    }

    if (maxLength) {
      validators.push(rawValue => {
        // If maxLength is provided we know the type of the rawValue will always be string
        const value = rawValue as string;

        if (isEmpty(value) || value.length > maxLength) {
          return (
            errorMessage || `${label || 'Field'} must be no more than ${maxLength} charactest long`
          );
        }
      });
    }

    if (initialValidators) {
      validators = validators.concat(initialValidators);
    }

    return (value: ValueType, formValues: any) =>
      validators.reduce<string | void>(
        (error, checkIsValid) => error || checkIsValid(value, formValues),
        undefined,
      );
  }, [
    initialValidators,
    validatePassword,
    errorMessage,
    inputType,
    minLength,
    maxLength,
    required,
    label,
    min,
    max,
  ]);

interface Options {
  label?: ReactNode;
  inputType?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: string | number;
  max?: string | number;
  errorMessage?: string;
  validatePassword?: boolean;
}

export type FieldValidator<ValueType = any, FormValues = any> = (
  value: ValueType | undefined,
  fomrValues: FormValues,
) => string | void;
