import { RadioOption } from 'components/forms/radio';
import { Option } from 'components/forms/select';

import { getRandomId } from './general';

export const getNewOption = <ValueType = Option | string>(
  value: ValueType,
): ValueType extends string ? Option<ValueType> : ValueType & Option => {
  if (typeof value === 'string') {
    return {
      key: getRandomId(),
      value,
    } as any;
  }

  return {
    key: getRandomId(),
    ...(value as any),
  };
};

export const createOptionList = <OptionType = Option | string>(options?: OptionType[] | null) =>
  (options || []).map(getNewOption);

export const mapOptionListToStrings = <DataType extends any>(
  options?: Option<DataType>[],
): DataType[] => (options || []).map(({ value }) => value);

export const removeOptionKey = <DataType extends Partial<Option>>({
  key, // eslint-disable-line @typescript-eslint/no-unused-vars
  ...rest
}: DataType): Omit<DataType, 'key'> => rest;

export const removeOptionKeyAndLabel = <DataType extends Partial<Option>>({
  key, // eslint-disable-line @typescript-eslint/no-unused-vars
  label, // eslint-disable-line @typescript-eslint/no-unused-vars
  ...rest
}: DataType): Omit<DataType, 'key' | 'label'> => rest;

export const filterUnselectedOptions = <DataType extends any>(
  options: Option<DataType>[] = [],
  selected: Option<DataType>[],
) =>
  options.filter(
    ({ value }) => !selected.some(selectedLanguage => selectedLanguage.value === value),
  );

export const getOptionsArray = <T extends string | number | boolean | null>(options: Option<T>[]) =>
  options;
export const getRadioOptionsArray = <T extends string | number | boolean | null>(
  options: RadioOption<T>[],
) => options;

export const submitForm = (providedForm: string | HTMLFormElement | null) => {
  const formElement =
    typeof providedForm === 'string' ? document.getElementById(providedForm) : providedForm;

  if (formElement !== null) {
    formElement.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  }
};
