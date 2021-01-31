import React, {
  useMemo,
  useCallback,
  memo,
  ChangeEvent,
  FocusEvent,
  MouseEvent,
  KeyboardEvent,
  ReactNode,
  forwardRef,
  useState,
} from 'react';
import { Form, Field, FieldRenderProps } from 'react-final-form';
import classnames from 'classnames';
import MatInput, { InputProps as MatInputProps } from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';

import { submitForm } from 'utils/form';
import { emptyFn } from 'utils/general';
import { getDefaultValidators, FieldValidator } from 'utils/validation';

import { IconButton, Unavailable } from '../../common';
import { Icon, IconProps, IconType } from '../../common/icon';

export const InputRenderer = forwardRef<any, InputRendererProps>(
  (
    {
      meta: { error, submitError, touched, dirtySinceLastSubmit },
      input,
      label,
      onChange,
      onBlur,
      onKeyPress,
      className: passedClassName,
      hideErrorMessage,
      required,
      trimValue,
      simple,
      disableUnderline = !!simple,
      icon,
      endIcon,
      iconColor = 'action',
      endIconColor = 'action',
      onIconClick,
      onEndIconClick,
      fontSize,
      hint,
      hintAsError,
      unavailable,
      disabled,
      prefix,
      width,
      ...rest
    },
    ref,
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const { name } = input;
    const randomId = useMemo(() => `input-${name}-${Math.floor(Math.random() * 10000)}`, [name]);
    const errorMessage = touched && (error || (!dirtySinceLastSubmit && submitError));

    const handleChange = useCallback(
      (event: InputChangeEvent) => {
        const {
          target: { value },
        } = event;

        if (onChange) {
          onChange(event, value);
        }

        input.onChange(event);
      },
      [onChange, input],
    );
    const handleBlur = useCallback(
      (event: InputFocusEvent) => {
        const {
          target: { value },
        } = event;

        if (onBlur) {
          onBlur(event, value);
        }

        if (trimValue && value) {
          input.onChange(value.trim());
        }

        input.onBlur(event);
      },
      [onBlur, trimValue, input],
    );
    const handleKeyPress = useCallback(
      (event: KeyboardEvent<HTMLInputElement>) => {
        const { key, ctrlKey } = event;

        if (onKeyPress) {
          onKeyPress(event);
        }

        if (ctrlKey && /[\n\r]/.test(key)) {
          const textArea = event.target as HTMLInputElement;
          submitForm(textArea.closest('form'));
        }
      },
      [onKeyPress],
    );
    const isPasswordField = input.type === 'password';

    const iconProps = {
      className: 'icon start-icon',
      color: iconColor,
    };
    const endIconProps = {
      className: 'icon end-icon',
      color: endIconColor,
    };
    const renderStartAdornment = () => {
      if (icon) {
        if (onIconClick) {
          return (
            <IconButton
              type={icon}
              onClick={event => onIconClick(event, input.value)}
              {...iconProps}
            />
          );
        }

        return <Icon type={icon} {...iconProps} />;
      }

      return prefix;
    };
    const renderEndAdornment = () => {
      if (endIcon) {
        if (onEndIconClick) {
          return (
            <IconButton
              type={endIcon}
              onClick={event => onEndIconClick(event, input.value)}
              {...endIconProps}
            />
          );
        }

        return <Icon type={endIcon} {...endIconProps} />;
      }

      if (isPasswordField) {
        return (
          <IconButton
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            type={isPasswordVisible ? 'eyeSlash' : 'eye'}
            {...endIconProps}
          />
        );
      }
    };
    const className = classnames(
      'sec-input',
      errorMessage ? 'has-error' : 'no-error',
      simple && 'simple',
      !label && 'no-label',
      isPasswordField && 'password',
      passedClassName,
    );

    const field = (
      <FormControl className={className} error={!!errorMessage} style={{ width }}>
        {label && <InputLabel htmlFor={randomId}>{`${label}${required ? ' *' : ''}`}</InputLabel>}

        <MatInput
          id={randomId}
          disableUnderline={disableUnderline}
          disabled={disabled || unavailable}
          startAdornment={
            (icon || prefix) && (
              <InputAdornment position="start">{renderStartAdornment()}</InputAdornment>
            )
          }
          endAdornment={
            (endIcon || isPasswordField) && (
              <InputAdornment position="end">{renderEndAdornment()}</InputAdornment>
            )
          }
          style={{ fontSize }}
          ref={ref}
          {...input}
          {...rest}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          type={isPasswordVisible ? 'text' : input.type}
        />

        {hint && !(errorMessage && hintAsError) && (
          <FormHelperText className="helper">{hint}</FormHelperText>
        )}

        {!hideErrorMessage && errorMessage && (
          <FormHelperText>{hintAsError ? hint : errorMessage}</FormHelperText>
        )}
      </FormControl>
    );

    if (unavailable) {
      return <Unavailable>{field}</Unavailable>;
    }

    return field;
  },
) as (props: InputRendererProps) => JSX.Element;

const parser = (value: any) => value;
const InputComponent = forwardRef<any, InputProps>(
  (
    {
      name,
      type = 'text',
      defaultValue,
      validators: customValidators,
      label,
      required,
      minLength,
      maxLength,
      min,
      max,
      errorMessage,
      validatePassword,
      ...rest
    },
    ref,
  ) => {
    const validators = useMemo(
      () =>
        getDefaultValidators<string>({
          inputType: type,
          min,
          max,
          label,
          required,
          minLength,
          maxLength,
          errorMessage,
          validatePassword,
        }).concat(customValidators || []),
      [
        min,
        max,
        type,
        label,
        required,
        minLength,
        maxLength,
        customValidators,
        errorMessage,
        validatePassword,
      ],
    );

    const validator = useCallback(
      (value?: string, formValues?: any) =>
        validators.reduce<string | void>(
          (error, validate) => (error !== undefined ? error : validate(value, formValues)),
          undefined,
        ),
      [validators],
    );
    const renderer = useCallback(
      (props: FieldRenderProps<string>) => <InputRenderer {...props} ref={ref} />,
      [ref],
    );
    const renderField = () => (
      <Field
        name={name || 'field'}
        type={type}
        initialValue={defaultValue}
        render={renderer}
        validate={validator}
        label={label}
        required={required}
        parse={parser}
        {...rest}
      />
    );

    if (!name) {
      return <Form onSubmit={emptyFn} render={renderField} />;
    }

    return renderField();
  },
);

export const Input = memo(InputComponent) as (props: InputProps) => JSX.Element;

type BaseRendererProps = FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement>;
type InputRendererProps = BaseRendererProps & Omit<InputProps, 'name'>;
type InputChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type InputFocusEvent = FocusEvent<HTMLInputElement | HTMLTextAreaElement>;
type InputFocusHandler = (event: InputFocusEvent, inputValue: string) => void;
type OverwrittenProps = 'value' | 'onChange' | 'onBlur';

export type InputChangeHandler = (event: InputChangeEvent, inputValue: string) => void;
export type InputType = 'text' | 'time' | 'number' | 'tel' | 'email' | 'password';
export interface InputProps extends Omit<MatInputProps, OverwrittenProps> {
  name?: string;
  onChange?: InputChangeHandler;
  onBlur?: InputFocusHandler;
  type?: InputType;
  defaultValue?: string;
  validators?: FieldValidator[];
  label?: string;
  placeholder?: string;
  className?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  errorMessage?: string;
  hideErrorMessage?: boolean;
  trimValue?: boolean;
  simple?: boolean;
  icon?: IconType;
  endIcon?: IconType;
  iconColor?: IconProps['color'];
  endIconColor?: IconProps['color'];
  onIconClick?: (event: MouseEvent<HTMLButtonElement>, inputValue: string) => any;
  onEndIconClick?: (event: MouseEvent<HTMLButtonElement>, inputValue: string) => any;
  fontSize?: number;
  hint?: ReactNode;
  hintAsError?: boolean;
  validatePassword?: boolean;
  unavailable?: boolean;
  prefix?: string;
  width?: number;
}
