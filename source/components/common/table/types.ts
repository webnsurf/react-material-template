import { ReactNode } from 'react';
import { FormApi } from 'final-form';
import { TableCellProps } from '@material-ui/core/TableCell';

import { InputProps } from '../../forms/input';

interface RenderProps<DataType> {
  data: DataType;
  isEdit: boolean;
  index: number;
  form?: FormApi<FormData<DataType>>;
}

export interface InternalData {
  key: string;
}

export type FormData<DataType> = { items: (DataType & InternalData)[] };

export interface TableColumn<DataType = any> extends TableCellProps {
  title?: string;
  key?: string;
  dataIndex?: keyof DataType;
  width?: number | string;
  maxWidth?: number | string;
  render?: (value: any, props: RenderProps<DataType>) => ReactNode;
  tooltip?: (value: any, props: RenderProps<DataType>) => string;
  ellipsis?: boolean;
  inputProps?: Omit<InputProps, 'name'>;
  indexColumn?: boolean;
}

export type TableDataType = Record<string, any>;

export type TableFieldProps<FieldProps> = FieldProps & {
  rowIndex: number;
};
