import React, { memo, useCallback, ReactNode, forwardRef } from 'react';
import { Field, FieldRenderProps, Form } from 'react-final-form';
import classnames from 'classnames';
import Autocomplete, { AutocompleteProps } from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

import { useFieldValidation, FieldValidator } from 'utils/validation';
import { emptyFn } from 'utils/general';

import { Unavailable, Spinner } from '../../common';
import { Icon, IconProps } from '../../common/icon/Icon';

const defaultOptions: OptionType[] = [];
const getOptionLabel = (option: OptionType) => String(option.label || option.value || option);
const getIsOptionsDisabled = (option: OptionType) => !!option.disabled;

export const SelectRenderer = forwardRef<any, SelectRendererProps>(
  (
    {
      meta: { error, submitError, touched, dirtySinceLastSubmit },
      input,
      label,
      onChange,
      onInputChange,
      endIcon,
      endIconColor,
      endIconSize = 26,
      className: passedClassName,
      hideErrorMessage,
      options = defaultOptions,
      loading,
      loadingData,
      required,
      simple,
      disableUnderline = !!simple,
      placeholder,
      defaultValue,
      controlled = false,
      selectKey,
      unavailable,
      disabled,
      width,
      ...rest
    },
    ref,
  ) => {
    const errorMessage = touched && (error || (!dirtySinceLastSubmit && submitError));
    const className = classnames(
      'sec-select',
      errorMessage ? 'has-error' : 'no-error',
      endIcon && 'custom-icon',
      simple && 'simple',
      !label && 'no-label',
      passedClassName,
    );

    const selectedValue = options.find(option => option.value === input.value) || null;
    const renderInput = useCallback(
      params => (
        <TextField
          {...params}
          InputProps={{
            ...params.InputProps,
            disableUnderline,
          }}
          inputProps={{
            ...params.inputProps,
            onChange: event => {
              params.inputProps.onChange(event);

              if (onInputChange) {
                onInputChange((event.target as HTMLInputElement).value);
              }
            },
          }}
          className="input"
          label={label && `${label}${required ? ' *' : ''}`}
          placeholder={placeholder}
          error={!!errorMessage}
        />
      ),
      [label, required, placeholder, errorMessage, onInputChange, disableUnderline],
    );

    const field = (
      <FormControl className={className} error={!!errorMessage} style={{ width }} ref={ref}>
        <Autocomplete
          key={selectKey}
          options={options}
          renderInput={renderInput}
          getOptionLabel={getOptionLabel}
          renderOption={getOptionLabel}
          getOptionDisabled={getIsOptionsDisabled}
          disabled={disabled || unavailable}
          defaultValue={defaultValue as any}
          loading={loadingData}
          loadingText={
            <div className="sec-select-autocomplete-loading">
              <Spinner className="data-spinner" type="transparent" size={24} simple /> Loading data
            </div>
          }
          popupIcon={
            <Icon type={endIcon || 'chevronDown'} size={endIconSize} color={endIconColor} />
          }
          disableClearable
          autoHighlight
          {...input}
          {...rest}
          multiple={false}
          value={selectedValue}
          onChange={(_, selectedOption) => {
            if (selectedOption) {
              if (onChange) {
                onChange(selectedOption);
              }

              if (!controlled) {
                input.onChange(selectedOption.value);
              }
            }
          }}
          onFocus={event => input.onFocus(event as any)}
          onBlur={event => input.onBlur(event as any)}
        />

        {loading && <Spinner className="spinner" iconSize={30} />}

        {!hideErrorMessage && errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
      </FormControl>
    );

    if (unavailable) {
      return <Unavailable>{field}</Unavailable>;
    }

    return field;
  },
) as <DataType extends ValueType>(props: SelectRendererProps<DataType>) => JSX.Element;

const SelectComponent = forwardRef<any, SelectProps>(
  ({ name, defaultValue, validators: customValidators, label, required, ...rest }, ref) => {
    const validate = useFieldValidation<ValueType>(
      {
        required,
        label,
      },
      customValidators,
    );

    const renderField = () => (
      <Field<ValueType>
        name={name || 'field'}
        initialValue={defaultValue}
        render={props => <SelectRenderer required={required} label={label} {...props} {...rest} />}
        validate={validate}
        ref={ref}
      />
    );

    if (!name) {
      return <Form onSubmit={emptyFn} render={renderField} />;
    }

    return renderField();
  },
);

export const Select = memo(SelectComponent) as <DataType extends ValueType>(
  props: SelectProps<DataType>,
) => JSX.Element;

export interface Option<ValueType = string> {
  value: ValueType;
  label?: ReactNode;
  key?: string | number;
  disabled?: boolean;
  unavailable?: boolean;
  meta?: any;
}

type OptionType = Option<any>;
type SelectRendererProps<DataType extends ValueType = ValueType> = Omit<
  SelectProps<DataType>,
  'name'
> &
  FieldRenderProps<DataType, HTMLInputElement>;
type OverwrittenProps =
  | 'value'
  | 'options'
  | 'onChange'
  | 'onInputChange'
  | 'defaultValue'
  | 'renderInput'
  | 'multiple';
type MatAcpProps = AutocompleteProps<OptionType, false, false, false>;

type ValueType = string | number | boolean | null;

export type SelectValueType = ValueType;
export interface SelectProps<DataType extends ValueType = ValueType>
  extends Omit<MatAcpProps, OverwrittenProps> {
  name?: string;
  options?: Option<DataType>[];
  label?: string;
  defaultValue?: DataType;
  validators?: FieldValidator<DataType>[];
  required?: boolean;
  hideErrorMessage?: boolean;
  loading?: boolean;
  loadingData?: boolean;
  onChange?: (selectedOption: OptionType) => any;
  onInputChange?: (value: string) => any;
  controlled?: boolean;
  selectKey?: any;
  endIcon?: IconProps['type'];
  endIconColor?: IconProps['color'];
  endIconSize?: IconProps['size'];
  simple?: boolean;
  disableUnderline?: boolean;
  unavailable?: boolean;
  width?: number;
}
