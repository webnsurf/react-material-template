import React, { ChangeEvent, memo, ReactNode, useMemo } from 'react';
import { Field, Form, FieldRenderProps } from 'react-final-form';
import classnames from 'classnames';
import MatRadio, { RadioProps as MatRadioProops } from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import { createOptionList } from 'utils/form';
import { FieldValidator, getDefaultValidators } from 'utils/validation';
import { getRandomString } from 'utils/general';
import { Unavailable } from 'components/common';

const RadioRenderer = <DataType extends ValueType>({
  meta: { error, submitError, touched, dirtySinceLastSubmit },
  input,
  onChange,
  className: passedClassName,
  containerClassName,
  hideErrorMessage,
  required,
  label,
  options,
  color = 'primary',
  heading,
  blockList,
}: RadioRendererProps<DataType>) => {
  const errorMessage = touched && (error || (!dirtySinceLastSubmit && submitError));
  const className = classnames(
    'sec-radio',
    errorMessage ? 'has-error' : 'no-error',
    blockList && 'block-list',
    passedClassName,
  );
  const mappedOptions = useMemo(() => createOptionList(options), [options]);
  const value = input.value !== undefined ? input.value : '';

  return (
    <FormControl className={className} error={!!errorMessage}>
      {label && <FormLabel focused={false}>{`${label}${required ? ' *' : ''}`}</FormLabel>}
      {heading && <h3>{heading}</h3>}

      <RadioGroup
        {...input}
        className={classnames('group', containerClassName)}
        value={value}
        onChange={(event, rawValue) => {
          const optionValue = options.find(opt => String(opt.value) === rawValue)?.value;

          if (optionValue !== undefined) {
            if (onChange) {
              onChange(event, optionValue);
            }

            input.onChange(optionValue);
          }
        }}
        onFocus={e => input.onFocus(e as any)}
        onBlur={e => input.onBlur(e as any)}
      >
        {mappedOptions.map(({ unavailable, ...rest }) => (
          <Unavailable active={!!unavailable} key={rest.key}>
            <FormControlLabel
              label={rest.label || rest.value}
              value={input.value}
              control={<MatRadio color={color} disabled={unavailable} {...rest} />}
            />
          </Unavailable>
        ))}
      </RadioGroup>

      {!hideErrorMessage && errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );
};

const RadioComponent = <DataType extends ValueType>({
  name,
  label,
  required,
  defaultValue,
  errorMessage,
  validators: customValidators,
  heading,
  ...rest
}: RadioProps<DataType>) => {
  const validators = useMemo(
    () =>
      getDefaultValidators<DataType>({
        inputType: 'radio',
        label: label || heading,
        required,
        errorMessage,
      }).concat(customValidators || []),
    [label, heading, required, customValidators, errorMessage],
  );

  const validator = (value?: DataType, formValues = {}) =>
    validators.reduce<string | void>(
      (error, validate) => (error !== undefined ? error : validate(value, formValues)),
      undefined,
    );

  const field = (
    <Field
      name={useMemo(() => name || getRandomString(), [name])}
      render={RadioRenderer as any}
      initialValue={defaultValue}
      validate={validator}
      label={label}
      heading={heading}
      required={required}
      {...rest}
    />
  );

  if (!name) {
    return <Form onSubmit={() => {}}>{() => field}</Form>;
  }

  return field;
};

export const Radio = memo(RadioComponent) as typeof RadioComponent;

type ValueType = string | number | boolean;
type RadioRendererProps<DataType extends ValueType = ValueType> = FieldRenderProps<
  DataType,
  HTMLInputElement
> &
  Omit<RadioProps<DataType>, 'name'>;

interface RadioProps<DataType extends ValueType = ValueType> {
  options: RadioOption<DataType>[];
  name?: string;
  label?: string;
  className?: string;
  required?: boolean;
  errorMessage?: string;
  hideErrorMessage?: boolean;
  defaultValue?: DataType;
  onChange?: (event: ChangeEvent<HTMLInputElement>, value: DataType) => any;
  color?: MatRadioProops['color'];
  validators?: FieldValidator<DataType>[];
  heading?: ReactNode;
  containerClassName?: string;
  blockList?: boolean;
}

export interface RadioOption<DataType = ValueType> extends Omit<MatRadioProops, 'key'> {
  label?: ReactNode;
  value: DataType;
}
