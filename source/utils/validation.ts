import { ReactNode } from 'react';
import validator from 'validator';

function isEmpty(value?: ValueType) {
  const initialNotEmpty = value !== undefined && value !== null && value !== '';

  if (typeof value === 'string') {
    return !(initialNotEmpty && value.trim());
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return !initialNotEmpty;
  }

  if (Array.isArray(value)) {
    return !(initialNotEmpty && value.length);
  }

  return true;
}

export const getDefaultValidators = <T extends ValueType>({
  inputType,
  label,
  required,
  minLength,
  maxLength,
  min,
  max,
  errorMessage,
  validatePassword,
}: Options): FieldValidator<T>[] => {
  const defaultValidators: FieldValidator<ValueType>[] = [];

  if (required) {
    defaultValidators.push(rawValue => {
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
    defaultValidators.push(rawValue => {
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
    defaultValidators.push(rawValue => {
      // If inputType === 'email' we know the type of the rawValue will always be string
      const value = String(rawValue || '');

      if ((value || required) && !validator.isEmail(value)) {
        return errorMessage || 'Email address is in a wrong format';
      }
    });
  }

  if (inputType && ['number', 'tel'].includes(inputType)) {
    if (min !== undefined) {
      defaultValidators.push(rawValue => {
        // If inputType is 'number' || 'tel' we know the type of the rawValue will always be number
        const value = Number(rawValue);

        if (value < min) {
          return errorMessage || `Minimum value for ${label || 'Field'} is ${min}`;
        }
      });
    }

    if (max !== undefined) {
      defaultValidators.push(rawValue => {
        // If inputType is 'number' || 'tel' we know the type of the rawValue will always be number
        const value = Number(rawValue);

        if (value > max) {
          return errorMessage || `Maximum value for ${label || 'Field'} is ${max}`;
        }
      });
    }
  }

  if (minLength) {
    defaultValidators.push(rawValue => {
      // If minLength is provided we know the type of the rawValue will always be string
      const value = rawValue as string;

      if (isEmpty(value) || value.length < minLength) {
        return errorMessage || `${label || 'Field'} must be at least ${minLength} charactest long`;
      }
    });
  }

  if (maxLength) {
    defaultValidators.push(rawValue => {
      // If maxLength is provided we know the type of the rawValue will always be string
      const value = rawValue as string;

      if (isEmpty(value) || value.length > maxLength) {
        return (
          errorMessage || `${label || 'Field'} must be no more than ${maxLength} charactest long`
        );
      }
    });
  }

  return defaultValidators;
};

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

type ValueType = string | number | string[] | boolean | null;
export type FieldValidator<T extends ValueType = string, FormValues extends any = any> = (
  value: T | undefined,
  formValues: FormValues,
) => string | void;
