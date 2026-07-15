import { type PropType, type ExtractPropTypes, type VNode } from 'vue';

/**
 * 泛型列定义 - 使用 TypeScript 泛型约束行数据类型
 * T 代表行数据的类型
 */
export interface TableColumn<T = Record<string, unknown>> {
  /** 列唯一标识 */
  key: string;
  /** 列标题 */
  title: string;
  /** 数据字段名 */
  dataIndex: keyof T & string;
  /** 列宽 */
  width?: string | number;
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right';
  /** 是否可排序 */
  sortable?: boolean;
  /** 自定义渲染函数 */
  render?: (row: T, index: number) => VNode | string;
  /** 自定义插槽名 */
  slotName?: string;
  /** 固定列 */
  fixed?: 'left' | 'right';
  /** 格式化函数 */
  formatter?: (value: unknown, row: T) => string;
}

export type SortOrder = 'asc' | 'desc' | null;

export interface SortState {
  key: string;
  order: SortOrder;
}

export interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey?: keyof T & string;
  bordered?: boolean;
  striped?: boolean;
  loading?: boolean;
  emptyText?: string;
  sortState?: SortState | null;
}

export const tableProps = {
  columns: { type: Array as PropType<TableColumn<any>[]>, required: true },
  data: { type: Array as PropType<any[]>, required: true },
  rowKey: { type: String, default: 'id' },
  bordered: { type: Boolean, default: false },
  striped: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  emptyText: { type: String, default: '暂无数据' },
  sortState: { type: Object as PropType<SortState | null>, default: null },
} as const;

export type TablePropsType = ExtractPropTypes<typeof tableProps>;

export interface TableEmits {
  (e: 'sort-change', sortState: SortState): void;
  (e: 'row-click', row: Record<string, unknown>, index: number): void;
}
