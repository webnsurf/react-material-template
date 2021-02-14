import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FormApi } from 'final-form';
import classnames from 'classnames';

import { filterUnselectedOptions, getNewOption } from 'utils/form';

import { Tag, TagProps } from '../../common/tag';
import { Option, Select, SelectProps, SelectValueType } from './Select';

export const SelectWithList = <DataType extends SelectValueType>({
  name,
  form,
  selectedOptions,
  label = 'Enter an option',
  className: providedClassName,
  onRenderTagValue,
  tagClassName,
  tagSize,
  onUpdate,
  options,
  ...rest
}: SelectWithListProps<DataType>) => {
  const selectRef = useRef<HTMLDivElement>();
  const [updates, setUpdates] = useState(0);
  const addOption = useCallback(
    value => {
      const newValues = [...selectedOptions, getNewOption(value)];
      form.change(name, newValues);
      setUpdates(oldUpdates => oldUpdates + 1);

      if (onUpdate) {
        onUpdate(newValues);
      }

      // Once we update the selectKey the field loses focus.
      // This is here to reset that focus on the input
      setTimeout(() => {
        if (selectRef.current?.click) {
          selectRef.current.click();
        }
      }, 0);
    },
    [selectedOptions, form, name, onUpdate],
  );
  const removeOption = useCallback(
    (option: Option<DataType>) => {
      const insuranceIndex = selectedOptions.indexOf(option);
      const newValues = [...selectedOptions];
      newValues.splice(insuranceIndex, 1);

      form.change(name, newValues);

      if (onUpdate) {
        onUpdate(newValues);
      }
    },
    [selectedOptions, form, name, onUpdate],
  );
  const remainingOptions = useMemo(() => filterUnselectedOptions(options, selectedOptions), [
    options,
    selectedOptions,
  ]);

  return (
    <div className={classnames('sec-select-with-list', providedClassName)}>
      <Select
        // Key here is to re-render the component (removing focus from the search input)
        // once one of the uptions are selected. This resets the available options in the list
        selectKey={updates}
        name={name}
        label={label}
        className="full-width"
        onChange={addOption}
        options={remainingOptions}
        ref={selectRef}
        controlled
        {...rest}
      />

      {selectedOptions.length > 0 && (
        <div className="option-items">
          {selectedOptions.map(option => (
            <Tag
              key={String(option.key || option.value)}
              value={option}
              label={option.label || option.value}
              className={classnames('option-item-tag', tagClassName)}
              onRemove={removeOption}
              render={onRenderTagValue}
              size={tagSize}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export interface SelectWithListProps<DataType extends SelectValueType = any>
  extends SelectProps<DataType> {
  name: string;
  form: FormApi<any>;
  selectedOptions: Option<DataType>[];
  onUpdate?: (selectedOptions: Option<DataType>[]) => any;
  onRenderTagValue?: TagProps<Option<DataType>>['render'];
  tagSize?: TagProps<Option<DataType>>['size'];
  tagClassName?: string;
}
