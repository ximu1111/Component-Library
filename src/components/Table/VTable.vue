<template>
  <div :class="wrapperClasses">
    <div v-if="loading" class="v-table__loading">
      <div class="v-table__loading-spinner" />
      <span>加载中...</span>
    </div>
    <table class="v-table__table">
      <thead class="v-table__head">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :class="thClasses(col)"
            :style="thStyle(col)"
            @click="col.sortable ? handleSort(col) : undefined"
          >
            <div class="v-table__th-inner">
              <span>{{ col.title }}</span>
              <span v-if="col.sortable" class="v-table__sort-icon">
                <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"
                  :class="{ active: sortState?.key === col.key && sortState?.order === 'asc' }">
                  <path d="M8 4l4 5H4z"/>
                </svg>
                <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"
                  :class="{ active: sortState?.key === col.key && sortState?.order === 'desc' }">
                  <path d="M8 12l4-5H4z"/>
                </svg>
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="v-table__body">
        <template v-if="data.length > 0">
          <tr
            v-for="(row, rowIndex) in data"
            :key="getRowKey(row, rowIndex)"
            :class="['v-table__row', { 'v-table__row--striped': striped && rowIndex % 2 === 1 }]"
            @click="handleRowClick(row, rowIndex)"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              :class="tdClasses(col)"
              :style="tdStyle(col)"
            >
              <slot v-if="col.slotName" :name="col.slotName" :row="row" :index="rowIndex" :value="getRowValue(row, col.dataIndex)" />
              <span v-else>{{ getCellText(row, col) }}</span>
            </td>
          </tr>
        </template>
        <tr v-else>
          <td :colspan="columns.length" class="v-table__empty">
            <slot name="empty">{{ emptyText }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TableColumn, SortState } from './types';

defineOptions({ name: 'VTable', inheritAttrs: false });

const props = withDefaults(defineProps<{
  columns: TableColumn<any>[];
  data: any[];
  rowKey?: string;
  bordered?: boolean;
  striped?: boolean;
  loading?: boolean;
  emptyText?: string;
  sortState?: SortState | null;
}>(), {
  rowKey: 'id',
  bordered: false,
  striped: false,
  loading: false,
  emptyText: '暂无数据',
  sortState: null,
});

const emit = defineEmits<{
  (e: 'sort-change', sortState: SortState): void;
  (e: 'row-click', row: any, index: number): void;
}>();

const wrapperClasses = computed(() => [
  'v-table',
  { 'v-table--bordered': props.bordered },
]);

function getRowKey(row: any, index: number): string | number {
  return (row[props.rowKey!] as string | number) ?? index;
}

function getRowValue(row: any, dataIndex: string): unknown {
  return row[dataIndex];
}

function getCellText(row: any, col: TableColumn<any>): string {
  const val = row[col.dataIndex];
  if (col.formatter) return col.formatter(val, row);
  return val != null ? String(val) : '';
}

function thClasses(col: TableColumn<any>): Record<string, boolean> {
  return {
    'v-table__th': true,
    [`v-table__th--align-${col.align || 'left'}`]: true,
    'v-table__th--sortable': !!col.sortable,
  };
}

function thStyle(col: TableColumn<any>): Record<string, string> {
  const s: Record<string, string> = {};
  if (col.width) s.width = typeof col.width === 'number' ? `${col.width}px` : col.width;
  return s;
}

function tdClasses(col: TableColumn<any>): Record<string, boolean> {
  return {
    'v-table__td': true,
    [`v-table__td--align-${col.align || 'left'}`]: true,
  };
}

function tdStyle(col: TableColumn<any>): Record<string, string> {
  const s: Record<string, string> = {};
  if (col.width) s.width = typeof col.width === 'number' ? `${col.width}px` : col.width;
  return s;
}

function handleSort(col: TableColumn<any>): void {
  const currentKey = props.sortState?.key;
  const currentOrder = props.sortState?.order;
  let newOrder: 'asc' | 'desc' | null;

  if (currentKey !== col.key) {
    newOrder = 'asc';
  } else if (currentOrder === 'asc') {
    newOrder = 'desc';
  } else if (currentOrder === 'desc') {
    newOrder = null;
  } else {
    newOrder = 'asc';
  }

  emit('sort-change', { key: col.key, order: newOrder });
}

function handleRowClick(row: Record<string, unknown>, index: number): void {
  emit('row-click', row, index);
}
</script>

<style lang="scss" scoped>
.v-table {
  position: relative;
  width: 100%;
  overflow-x: auto;

  &__table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  &__th {
    padding: $spacing-md $spacing-base;
    font-weight: 600;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    background: $color-bg-hover;
    border-bottom: 1px solid $color-border;
    white-space: nowrap;
    user-select: none;

    &--sortable { cursor: pointer; &:hover { color: $color-primary; } }
    &--align-left { text-align: left; }
    &--align-center { text-align: center; }
    &--align-right { text-align: right; }
  }

  &__th-inner {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  &__sort-icon {
    display: inline-flex;
    flex-direction: column;
    gap: 0;
    color: $color-text-disabled;
    svg { opacity: 0.4; transition: opacity $transition-fast; &.active { opacity: 1; color: $color-primary; } }
  }

  &__td {
    padding: $spacing-md $spacing-base;
    font-size: $font-size-base;
    color: $color-text;
    border-bottom: 1px solid $color-border-light;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &--align-left { text-align: left; }
    &--align-center { text-align: center; }
    &--align-right { text-align: right; }
  }

  &__row {
    transition: background $transition-fast;
    &:hover { background: rgba($color-primary, 0.04); cursor: pointer; }
    &--striped { background: $color-bg-hover; }
  }

  &__empty {
    text-align: center;
    padding: $spacing-2xl;
    color: $color-text-disabled;
    font-size: $font-size-base;
  }

  &--bordered {
    .v-table__th, .v-table__td { border: 1px solid $color-border-light; }
  }

  &__loading {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;
    background: rgba(255,255,255,0.7);
    z-index: 1;
    font-size: $font-size-sm;
    color: $color-text-secondary;
  }

  &__loading-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid $color-border-light;
    border-top-color: $color-primary;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
