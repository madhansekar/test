import type { ReactNode } from 'react';

export type TableColumn<T> = {
  key: string;
  title: string;
  width?: number;
  flex?: number;
  render?: (row: T, rowIndex: number) => ReactNode;
};

export type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  rowKey?: (row: T, index: number) => string;
  className?: string;
};
