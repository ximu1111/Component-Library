<template>
  <button
    :class="btnClasses"
    :disabled="disabled || loading"
    :type="nativeType"
    v-bind="$attrs"
    @click="handleClick"
  >
    <span v-if="loading" class="btn__loading-icon">
      <svg viewBox="0 0 16 16" width="1em" height="1em">
        <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2" fill="none"
          stroke-dasharray="40 60" stroke-linecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0 8 8" to="360 8 8" dur="0.8s" repeatCount="indefinite" />
        </circle>
      </svg>
    </span>
    <span v-if="$slots.default" class="btn__content">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { buttonProps } from './types';

defineOptions({ name: 'VButton', inheritAttrs: false });

const props = defineProps(buttonProps);
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const btnClasses = computed(() => [
  'v-btn',
  `v-btn--type-${props.type}`,
  `v-btn--size-${props.size}`,
  {
    'v-btn--disabled': props.disabled,
    'v-btn--loading': props.loading,
    'v-btn--plain': props.plain,
    'v-btn--round': props.round,
    'v-btn--circle': props.circle,
  },
]);

function handleClick(evt: MouseEvent): void {
  if (!props.disabled && !props.loading) {
    emit('click', evt);
  }
}
</script>

<style lang="scss" scoped>
.v-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid $color-border;
  border-radius: $radius-base;
  font-family: $font-family;
  font-weight: 500;
  cursor: pointer;
  transition: all $transition-fast;
  outline: none;
  white-space: nowrap;
  user-select: none;
  line-height: 1;

  &--size-small { height: 28px; padding: 0 12px; font-size: $font-size-xs; }
  &--size-medium { height: 36px; padding: 0 16px; font-size: $font-size-base; }
  &--size-large { height: 44px; padding: 0 24px; font-size: $font-size-lg; }

  &--type-default { background: $color-bg; color: $color-text; &:hover:not(:disabled) { border-color: $color-primary; color: $color-primary; } }
  &--type-primary { background: $color-primary; color: #fff; border-color: $color-primary; &:hover:not(:disabled) { background: $color-primary-light; border-color: $color-primary-light; } }
  &--type-success { background: $color-success; color: #fff; border-color: $color-success; &:hover:not(:disabled) { opacity: 0.85; } }
  &--type-warning { background: $color-warning; color: #fff; border-color: $color-warning; &:hover:not(:disabled) { opacity: 0.85; } }
  &--type-danger { background: $color-danger; color: #fff; border-color: $color-danger; &:hover:not(:disabled) { opacity: 0.85; } }

  &--plain.v-btn--type-primary { background: transparent; color: $color-primary; }
  &--plain.v-btn--type-success { background: transparent; color: $color-success; }
  &--plain.v-btn--type-warning { background: transparent; color: $color-warning; }
  &--plain.v-btn--type-danger { background: transparent; color: $color-danger; }

  &--round { border-radius: $radius-round; }
  &--circle { border-radius: 50%; padding: 0; width: 36px; }

  &--disabled, &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &--loading { cursor: wait; opacity: 0.75; }

  &__loading-icon { display: inline-flex; animation: spin 0.8s linear infinite; }
  &__content { display: inline-flex; align-items: center; }
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
