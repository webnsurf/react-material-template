import React, { Fragment, memo, useCallback, useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { FormApi } from 'final-form';
import TableCell from '@material-ui/core/TableCell';
import MatTableRow from '@material-ui/core/TableRow';
import classnames from 'classnames';

import { Input, InputChangeHandler, InputProps } from '../../forms/input';
import { Select, SelectProps } from '../../forms/select';
import { IconButton } from '../button';
import { Popconfirm } from '../popconfirm';
import { TableColumn, TableDataType } from './types';
import { Spinner } from '../spinner';
import { Link } from '../link';

export const getColumnKey = (column: TableColumn) =>
  String(column.key || column.dataIndex || column.title);

export const TableInput = ({ className, ...rest }: InputProps) => (
  <Input
    className={classnames('table-input', className)}
    multiline={rest.type !== 'number'}
    disableUnderline={false}
    placeholder="Enter value"
    simple
    {...rest}
  />
);

export const TableSelect = ({ className, ...rest }: SelectProps) => (
  <Select
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
  rowKey,
  columns,
  initialData,
  form,
  loading = false,
  isNewOption = false,
  index: rowIndex,
  resolveRowClassName,
  onSubmit,
  onRemove,
  onEdit,
  onEditStart,
}: TableRowProps<DataType>) => {
  const [isEdit, setIsEdit] = useState(isNewOption);
  const [isLoading, setIsLoading] = useState(false);
  const toggleEdit = useCallback(() => {
    setIsEdit(old => {
      if (!old && onEditStart) {
        onEditStart();
      }

      return !old;
    });
  }, [onEditStart]);
  const rowData = (!isEdit && initialData) || data;
  const rowId = rowData[rowKey];
  const handleRemove = useCallback(async () => {
    if (onRemove) {
      try {
        setIsLoading(true);
        await onRemove(rowId);
      } finally {
        setIsLoading(false);
      }
    }
  }, [onRemove, rowId]);
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

  useEffect(() => {
    if (!loading) {
      setIsEdit(false);
    }
  }, [loading]);

  return (
    <Fragment>
      <MatTableRow className={className}>
        {columns.map((column, index) => {
          const {
            render,
            tooltip,
            dataIndex,
            link,
            align,
            width,
            maxWidth,
            ellipsis = !!width,
            inputProps,
            indexColumn,
            editable,
          } = column;
          const cellEditable = form && index === columns.length - 1;
          const cellClassName = classnames(
            'table-cell',
            ellipsis && 'ellipsis',
            cellEditable && 'editable',
            cellEditable && onRemove && 'removable',
            column.className,
          );
          const resolvedValue = indexColumn ? rowIndex + 1 : dataIndex && rowData[dataIndex];
          const fieldName = onSubmit ? String(dataIndex) : `items[${rowIndex}]${dataIndex}`;
          const renderField = () => {
            if (indexColumn || editable === false || !isEdit) {
              if (link) {
                return <Link to={link(resolvedValue, renderProps)}>{resolvedValue}</Link>;
              }

              return resolvedValue;
            }

            return <TableInput name={fieldName} onChange={handleEdit} {...inputProps} />;
          };
          const renderTooltip = () => {
            if (tooltip) {
              return tooltip(resolvedValue, renderProps);
            }

            if (ellipsis && resolvedValue) {
              return String(resolvedValue);
            }
          };
          const renderActions = () => {
            if (!cellEditable) {
              return null;
            }

            if (isEdit) {
              return (
                <div className="actions">
                  <IconButton type="check" color="primary" onClick={form?.submit} title="Save" />

                  {isNewOption ? (
                    <IconButton type="delete" title="Remove" color="error" onClick={handleRemove} />
                  ) : (
                    <IconButton
                      type="close"
                      title="Exit"
                      onClick={toggleEdit}
                      disabled={hasError}
                      color="error"
                    />
                  )}
                </div>
              );
            }

            return (
              <div className="actions">
                <IconButton type="edit" color="primary" title="Edit data" onClick={toggleEdit} />

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
              </div>
            );
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
              {renderActions()}
            </TableCell>
          );
        })}
      </MatTableRow>

      {(isLoading || loading) && (
        <tr className="sec-loading">
          <td>
            <Spinner className="loading" iconSize={30} />
          </td>
        </tr>
      )}
    </Fragment>
  );
};

export const TableRow = memo(({ onSubmit, form, data, ...rest }) => {
  if (!form && onSubmit) {
    return (
      <Form
        onSubmit={onSubmit}
        initialValues={data}
        render={props => (
          <TableRowComponent
            data={data}
            form={props.form}
            onSubmit={onSubmit}
            loading={props.submitting}
            {...rest}
          />
        )}
      />
    );
  }

  return <TableRowComponent form={form} data={data} {...rest} />;
}) as typeof TableRowComponent;

export interface TableRowProps<DataType extends TableDataType = any> {
  columns: TableColumn<DataType>[];
  data: DataType;
  index: number;
  rowKey: keyof DataType;
  initialData?: DataType;
  loading?: boolean;
  className?: string;
  isNewOption?: boolean;
  form?: FormApi<any>;
  resolveRowClassName?: (data: DataType) => string | null | undefined | false;
  onSubmit?: (data: DataType, form: FormApi<DataType>) => any;
  onRemove?: (key: string) => any;
  onEdit?: (value: any) => any;
  onEditStart?: () => any;
}
