<template>
  <div :class="['v-pagination', { 'v-pagination--disabled': disabled }]" v-bind="$attrs">
    <!-- Total -->
    <span v-if="layout.includes('total')" class="v-pagination__total">
      共 {{ total }} 条
    </span>

    <!-- Prev -->
    <button
      v-if="layout.includes('prev')"
      class="v-pagination__btn v-pagination__prev"
      :disabled="modelValue <= 1 || disabled"
      aria-label="上一页"
      @click="handlePageChange(modelValue - 1)"
    >
      <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M10.354 3.646a.5.5 0 010 .708L6.707 8l3.647 3.646a.5.5 0 01-.708.708l-4-4a.5.5 0 010-.708l4-4a.5.5 0 01.708 0z"/></svg>
    </button>

    <!-- Pager -->
    <div v-if="layout.includes('pager')" class="v-pagination__pager">
      <button
        v-for="page in displayedPages"
        :key="page"
        :class="['v-pagination__page', { 'v-pagination__page--active': page === modelValue }]"
        :disabled="disabled"
        @click="page !== '...' ? handlePageChange(page as number) : undefined"
      >
        {{ page }}
      </button>
    </div>

    <!-- Next -->
    <button
      v-if="layout.includes('next')"
      class="v-pagination__btn v-pagination__next"
      :disabled="modelValue >= totalPages || disabled"
      aria-label="下一页"
      @click="handlePageChange(modelValue + 1)"
    >
      <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M5.646 12.354a.5.5 0 010-.708L9.293 8 5.646 4.354a.5.5 0 11.708-.708l4 4a.5.5 0 010 .708l-4 4a.5.5 0 01-.708 0z"/></svg>
    </button>

    <!-- Sizes -->
    <select
      v-if="layout.includes('sizes')"
      class="v-pagination__sizes"
      :value="pageSize"
      :disabled="disabled"
      @change="handleSizeChange"
    >
      <option v-for="size in pageSizes" :key="size" :value="size">{{ size }} 条/页</option>
    </select>

    <!-- Jumper -->
    <div v-if="layout.includes('jumper')" class="v-pagination__jumper">
      <span>跳至</span>
      <input
        class="v-pagination__jumper-input"
        type="number"
        :min="1"
        :max="totalPages"
        :value="modelValue"
        :disabled="disabled"
        @change="handleJump"
      />
      <span>页</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { paginationProps } from './types';

defineOptions({ name: 'VPagination', inheritAttrs: false });

const props = defineProps(paginationProps);
const emit = defineEmits<{
  (e: 'update:modelValue', page: number): void;
  (e: 'update:pageSize', size: number): void;
  (e: 'change', page: number, pageSize: number): void;
  (e: 'size-change', size: number): void;
  (e: 'current-change', page: number): void;
}>();

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));

const displayedPages = computed<(number | string)[]>(() => {
  const total = totalPages.value;
  const current = props.modelValue;
  const count = props.pagerCount;

  if (total <= count) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const half = Math.floor(count / 2);
  let start = Math.max(2, current - half);
  let end = Math.min(total - 1, current + half);

  if (current <= half + 1) {
    end = count - 1;
  }
  if (current >= total - half) {
    start = total - count + 2;
  }

  const pages: (number | string)[] = [1];
  if (start > 2) pages.push('...');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('...');
  pages.push(total);

  return pages;
});

function handlePageChange(page: number): void {
  const clamped = Math.max(1, Math.min(page, totalPages.value));
  if (clamped !== props.modelValue) {
    emit('update:modelValue', clamped);
    emit('current-change', clamped);
    emit('change', clamped, props.pageSize);
  }
}

function handleSizeChange(evt: Event): void {
  const size = Number((evt.target as HTMLSelectElement).value);
  emit('update:pageSize', size);
  emit('size-change', size);
  const maxPage = Math.max(1, Math.ceil(props.total / size));
  if (props.modelValue > maxPage) {
    handlePageChange(maxPage);
  }
}

function handleJump(evt: Event): void {
  const page = Number((evt.target as HTMLInputElement).value);
  if (!isNaN(page)) handlePageChange(page);
}
</script>

<style lang="scss" scoped>
.v-pagination {
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-size-base;
  user-select: none;

  &--disabled { opacity: 0.5; pointer-events: none; }

  &__total {
    color: $color-text-secondary;
    font-size: $font-size-sm;
    white-space: nowrap;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid $color-border;
    border-radius: $radius-base;
    background: $color-bg;
    cursor: pointer;
    color: $color-text;
    transition: all $transition-fast;

    &:hover:not(:disabled) { border-color: $color-primary; color: $color-primary; }
    &:disabled { cursor: not-allowed; color: $color-text-disabled; }
  }

  &__pager {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  &__page {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    padding: 0 6px;
    border: 1px solid $color-border;
    border-radius: $radius-base;
    background: $color-bg;
    cursor: pointer;
    font-size: $font-size-base;
    color: $color-text;
    transition: all $transition-fast;

    &:hover:not(.v-pagination__page--active):not(:disabled) { border-color: $color-primary; color: $color-primary; }
    &--active { background: $color-primary; color: #fff; border-color: $color-primary; }
    &:disabled { cursor: not-allowed; }
  }

  &__sizes {
    height: 32px;
    padding: 0 $spacing-sm;
    border: 1px solid $color-border;
    border-radius: $radius-base;
    background: $color-bg;
    font-size: $font-size-sm;
    color: $color-text;
    cursor: pointer;
    outline: none;
    &:focus { border-color: $color-primary; }
  }

  &__jumper {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: $font-size-sm;
    color: $color-text-secondary;
  }

  &__jumper-input {
    width: 50px;
    height: 32px;
    padding: 0 $spacing-sm;
    border: 1px solid $color-border;
    border-radius: $radius-base;
    text-align: center;
    font-size: $font-size-sm;
    outline: none;
    -moz-appearance: textfield;
    &::-webkit-inner-spin-button, &::-webkit-outer-spin-button { -webkit-appearance: none; }
    &:focus { border-color: $color-primary; }
  }
}
</style>
