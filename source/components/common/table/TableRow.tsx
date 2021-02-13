import React, { Fragment, memo, useCallback, useState } from 'react';
import { FormApi } from 'final-form';
import TableCell from '@material-ui/core/TableCell';
import MatTableRow from '@material-ui/core/TableRow';
import classnames from 'classnames';

import { Input, InputChangeHandler, InputProps } from '../../forms/input';
import { Select, SelectProps } from '../../forms/select';
import { IconButton } from '../button';
import { Popconfirm } from '../popconfirm';
import { TableColumn, FormData, InternalData, TableDataType, TableFieldProps } from './types';

export const getColumnKey = (column: TableColumn) =>
  String(column.key || column.dataIndex || column.title);

export const TableInput = ({ rowIndex, name, className, ...rest }: TableFieldProps<InputProps>) => (
  <Input
    name={`items[${rowIndex}]${name}`}
    className={classnames('table-input', className)}
    multiline={rest.type !== 'number'}
    disableUnderline={false}
    placeholder="Enter value"
    simple
    {...rest}
  />
);

export const TableSelect = ({
  rowIndex,
  name,
  className,
  ...rest
}: TableFieldProps<SelectProps>) => (
  <Select
    name={`items[${rowIndex}]${name}`}
    className={classnames('table-select', className)}
    disableUnderline={false}
    placeholder="Select value"
    simple
    {...rest}
  />
);

const TableRowComponent = <DataType extends TableDataType>({
  className: providedClassName,
  data,
  columns,
  initialData,
  form,
  isNewOption = false,
  index: rowIndex,
  resolveRowClassName,
  onRemove,
  onEdit,
  onEditStart,
}: TableRowProps<DataType>) => {
  const [isEdit, setIsEdit] = useState(isNewOption);
  const toggleEdit = useCallback(() => {
    setIsEdit(old => {
      if (!old && onEditStart) {
        onEditStart();
      }

      return !old;
    });
  }, [onEditStart]);
  const rowData = (!isEdit && initialData) || data;
  const handleRemove = useCallback(() => {
    if (onRemove) {
      onRemove(rowData.key);
    }
  }, [onRemove, rowData.key]);
  const handleEdit: InputChangeHandler = useCallback(
    ({ target: { value } }) => {
      if (onEdit) {
        onEdit(value);
      }
    },
    [onEdit],
  );
  const className = classnames(
    'sec-table-row',
    isEdit && 'in-edit',
    onRemove && 'removable',
    providedClassName,
    resolveRowClassName && resolveRowClassName(rowData),
  );
  const renderProps = { data: rowData, isEdit, form, index: rowIndex };
  const errors = form?.getState().errors?.items;
  const rowErrors = errors && errors[rowIndex];
  const hasError = !!rowErrors;

  return (
    <MatTableRow className={className}>
      {columns.map((column, index) => {
        const {
          render,
          tooltip,
          dataIndex,
          align,
          width,
          maxWidth,
          ellipsis = !!width,
          inputProps,
          indexColumn,
        } = column;
        const cellEditable = form && index === columns.length - 1;
        const cellClassName = classnames(
          'table-cell',
          ellipsis && 'ellipsis',
          cellEditable && 'editable',
          column.className,
        );
        const resolvedValue = indexColumn ? rowIndex : dataIndex && rowData[dataIndex];
        const renderField = () => {
          if (!isEdit) {
            return resolvedValue;
          }

          return (
            <TableInput
              name={String(dataIndex)}
              onChange={handleEdit}
              rowIndex={rowIndex}
              {...inputProps}
            />
          );
        };

        const renderTooltip = () => {
          if (tooltip) {
            tooltip(resolvedValue, renderProps);
          }

          if (ellipsis && resolvedValue) {
            return String(resolvedValue);
          }
        };

        return (
          <TableCell
            align={align}
            width={width}
            key={getColumnKey(column)}
            title={renderTooltip()}
            className={cellClassName}
            style={{ maxWidth: ellipsis ? maxWidth || 200 : maxWidth }}
          >
            {render ? render(resolvedValue, renderProps) : renderField()}

            {cellEditable && (
              <div className="actions">
                {!isEdit && (
                  <Fragment>
                    <IconButton
                      type="edit"
                      color="primary"
                      title="Edit data"
                      onClick={toggleEdit}
                    />

                    {onRemove && (
                      <Popconfirm
                        title={
                          <span>
                            Are you sure you want to
                            <br />
                            remove the row?
                          </span>
                        }
                        onConfirm={handleRemove}
                        okText="Yes"
                      >
                        <IconButton type="delete" title="Remove" color="error" />
                      </Popconfirm>
                    )}
                  </Fragment>
                )}

                {isEdit && (
                  <Fragment>
                    <IconButton type="check" color="primary" onClick={form?.submit} title="Save" />

                    {isNewOption ? (
                      <IconButton
                        type="delete"
                        title="Remove"
                        color="error"
                        onClick={handleRemove}
                      />
                    ) : (
                      <IconButton
                        type="close"
                        title="Exit"
                        onClick={toggleEdit}
                        disabled={hasError}
                        color="error"
                      />
                    )}
                  </Fragment>
                )}
              </div>
            )}
          </TableCell>
        );
      })}
    </MatTableRow>
  );
};

export const TableRow = memo(TableRowComponent) as typeof TableRowComponent;

export interface TableRowProps<DataType extends TableDataType = any> {
  columns: TableColumn<DataType>[];
  data: DataType & InternalData;
  index: number;
  initialData?: DataType & InternalData;
  className?: string;
  isNewOption?: boolean;
  form?: FormApi<FormData<DataType>>;
  resolveRowClassName?: (data: DataType) => string | null | undefined | false;
  onRemove?: (key: string) => any;
  onEdit?: (value: any) => any;
  onEditStart?: () => any;
}
