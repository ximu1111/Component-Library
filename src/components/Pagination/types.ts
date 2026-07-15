import { type PropType, type ExtractPropTypes } from 'vue';

export type PaginationLayout = 'prev' | 'pager' | 'next' | 'total' | 'sizes' | 'jumper';

export interface PaginationProps {
  modelValue: number;
  total: number;
  pageSize?: number;
  pageSizes?: number[];
  layout?: PaginationLayout[];
  disabled?: boolean;
  pagerCount?: number;
}

export const paginationProps = {
  modelValue: { type: Number, required: true },
  total: { type: Number, required: true },
  pageSize: { type: Number, default: 10 },
  pageSizes: { type: Array as PropType<number[]>, default: () => [10, 20, 50, 100] },
  layout: { type: Array as PropType<PaginationLayout[]>, default: () => ['prev', 'pager', 'next'] },
  disabled: { type: Boolean, default: false },
  pagerCount: { type: Number, default: 7, validator: (v: number) => v >= 5 && v <= 21 && v % 2 === 1 },
} as const;

export type PaginationPropsType = ExtractPropTypes<typeof paginationProps>;

export interface PaginationEmits {
  (e: 'update:modelValue', page: number): void;
  (e: 'update:pageSize', size: number): void;
  (e: 'change', page: number, pageSize: number): void;
  (e: 'size-change', size: number): void;
  (e: 'current-change', page: number): void;
}
