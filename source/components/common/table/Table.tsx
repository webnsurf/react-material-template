import React, { useState, useCallback, useEffect, memo } from 'react';
import classnames from 'classnames';
import MatTable, { TableProps as MatTableProps } from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import MatTableRow from '@material-ui/core/TableRow';
import { Form, FormRenderProps } from 'react-final-form';
import { FormApi } from 'final-form';

import { notifications } from 'utils/notifications';
import { resolveError } from 'api/utils';

import { defaultFormSubscriptionWithValues } from '../../forms/form';
import { IconButton, IconButtonProps } from '../button';
import { Spinner } from '../spinner';
import { NoData } from '../no-data';
import { TableColumn, FormData, TableDataType } from './types';
import { getColumnKey, TableRow, TableRowProps } from './TableRow';

const TableComponent = <DataType extends TableDataType>({
  className: passedClassName,
  columns,
  loading,
  data: initialData,
  size = 'medium',
  rowKey = 'id',
  addButtonLabel = 'Add another',
  type = 'primary',
  throwOnError,
  getNewOption,
  onSubmit,
  onRowSubmit,
  resolveRowClassName,
  onAddNew,
  onRemove,
  onEditStart,
  ...props
}: TableProps<DataType>) => {
  const [data, setData] = useState(() => ({ items: initialData || [] }));
  const handleSubmit = useCallback(
    async (formData: FormData<DataType>, form: FormApi<FormData<DataType>>) => {
      if (onSubmit) {
        try {
          await onSubmit(formData.items, form);
        } catch (error) {
          if (throwOnError) {
            throw error;
          }

          notifications.error(resolveError(error));
        }
      }
    },
    [onSubmit, throwOnError],
  );

  useEffect(() => {
    setData({ items: initialData || [] });
  }, [initialData]);

  const className = classnames('sec-table', passedClassName, type, size);
  const renderTable = ({ form, values, invalid, submitting }: RendererProps<DataType>) => {
    const tableData = values?.items || data.items;
    const addNewRow = () => {
      if (getNewOption && form) {
        form.change('items', [...tableData, getNewOption()]);

        if (onAddNew) {
          onAddNew();
        }
      }
    };
    const removeRow = (key: string) => {
      if (form) {
        const newData = [...tableData];
        const itemToDelete = newData.find(item => item.key === key);
        const index = itemToDelete && newData.indexOf(itemToDelete);

        if (index !== undefined) {
          newData.splice(index, 1);
          form.change('items', newData);
          form.submit();
        }
      }
    };
    const renderBody = () => {
      if (!tableData?.length) {
        return (
          <tr>
            <td colSpan={columns.length}>
              <NoData align="center" label={loading ? 'Loading data...' : undefined} />
            </td>
          </tr>
        );
      }

      return tableData.map((rowData, index) => {
        const initialRowData = data.items.find(item => rowData[rowKey] === item[rowKey]);

        return (
          <TableRow
            key={rowData[rowKey]}
            rowKey={rowKey}
            data={rowData}
            columns={columns}
            initialData={initialRowData}
            isNewOption={!initialRowData}
            resolveRowClassName={resolveRowClassName}
            onRemove={onRemove || (getNewOption && removeRow)}
            onEditStart={onEditStart}
            onSubmit={onRowSubmit}
            className={type}
            index={index}
            form={form}
          />
        );
      });
    };

    return (
      <div className={className}>
        <MatTable size={size} {...props}>
          <TableHead>
            <MatTableRow>
              {columns.map(column => (
                <TableCell
                  align={column.align}
                  className={classnames(
                    'table-head-cell',
                    column.className,
                    column.ellipsis && 'ellipsis',
                  )}
                  width={column.width}
                  key={getColumnKey(column)}
                >
                  {column.title}
                </TableCell>
              ))}
            </MatTableRow>
          </TableHead>

          <TableBody>{renderBody()}</TableBody>
        </MatTable>

        {getNewOption && (
          <div className="table-add-button">
            <IconButton type="add" label={addButtonLabel} onClick={addNewRow} disabled={invalid} />
          </div>
        )}

        {(submitting || loading) && <Spinner className="loading" iconSize={30} />}
      </div>
    );
  };

  if (onSubmit) {
    return (
      <Form
        initialValues={data}
        onSubmit={handleSubmit}
        subscription={defaultFormSubscriptionWithValues}
        render={renderTable}
      />
    );
  }

  return renderTable({});
};

type RendererProps<DataType> = Partial<FormRenderProps<FormData<DataType>>>;

export const Table = memo(TableComponent) as typeof TableComponent;

export interface TableProps<DataType extends TableDataType = any>
  extends Omit<MatTableProps, 'onSubmit'> {
  columns: TableColumn<DataType>[];
  data?: DataType[] | null;
  loading?: boolean;
  rowKey?: keyof DataType;
  addButtonLabel?: IconButtonProps['label'];
  getNewOption?: () => DataType;
  onSubmit?: (data: DataType[], form: FormApi<FormData<DataType>>) => any;
  onRowSubmit?: TableRowProps<DataType>['onSubmit'];
  onRemove?: (id: string) => any;
  resolveRowClassName?: TableRowProps<DataType>['resolveRowClassName'];
  onEditStart?: TableRowProps<DataType>['onEditStart'];
  onAddNew?: () => any;
  type?: 'primary' | 'simple';
  throwOnError?: boolean;
}
