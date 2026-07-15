<template>
  <div :class="wrapperClasses">
    <template v-if="type !== 'textarea'">
      <div class="v-input__inner">
        <span v-if="$slots.prefix" class="v-input__prefix">
          <slot name="prefix" />
        </span>
        <input
          ref="inputRef"
          class="v-input__native"
          :type="type"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :maxlength="maxlength"
          v-bind="$attrs"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChange"
        />
        <span v-if="clearable && String(modelValue).length > 0" class="v-input__clear" @click="handleClear">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path d="M8 1a7 7 0 110 14A7 7 0 018 1zm2.12 4.88a.75.75 0 00-1.06-1.06L8 5.94 6.94 4.88a.75.75 0 00-1.06 1.06L6.94 7 5.88 8.06a.75.75 0 001.06 1.06L8 8.06l1.06 1.06a.75.75 0 001.06-1.06L9.06 7l1.06-1.06z"/>
          </svg>
        </span>
        <span v-if="$slots.suffix" class="v-input__suffix">
          <slot name="suffix" />
        </span>
      </div>
    </template>
    <template v-else>
      <textarea
        ref="inputRef"
        class="v-input__native v-input__textarea"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :rows="rows"
        v-bind="$attrs"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { inputProps } from './types';

defineOptions({ name: 'VInput', inheritAttrs: false });

const props = defineProps(inputProps);
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'change', value: string | number): void;
  (e: 'clear'): void;
  (e: 'input', value: string | number): void;
}>();

const inputRef = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);

const wrapperClasses = computed(() => [
  'v-input',
  `v-input--size-${props.size}`,
  {
    'v-input--disabled': props.disabled,
    'v-input--focused': false,
    'v-input--textarea': props.type === 'textarea',
  },
]);

function handleInput(evt: Event): void {
  const target = evt.target as HTMLInputElement;
  const val = props.type === 'number' ? Number(target.value) : target.value;
  emit('update:modelValue', val);
  emit('input', val);
}

function handleFocus(evt: FocusEvent): void { emit('focus', evt); }
function handleBlur(evt: FocusEvent): void { emit('blur', evt); }

function handleChange(evt: Event): void {
  const target = evt.target as HTMLInputElement;
  const val = props.type === 'number' ? Number(target.value) : target.value;
  emit('change', val);
}

function handleClear(): void {
  emit('update:modelValue', '');
  emit('clear');
}

/** 暴露 focus / blur 方法供外部调用 */
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
});
</script>

<style lang="scss" scoped>
.v-input {
  display: inline-flex;
  width: 100%;

  &__inner {
    display: inline-flex;
    align-items: center;
    width: 100%;
    border: 1px solid $color-border;
    border-radius: $radius-base;
    background: $color-bg;
    transition: border-color $transition-fast;

    &:focus-within { border-color: $color-primary; box-shadow: 0 0 0 2px rgba($color-primary, 0.12); }
  }

  &__native {
    flex: 1;
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-family: $font-family;
    color: $color-text;

    &::placeholder { color: $color-text-disabled; }
  }

  &__textarea {
    resize: vertical;
    min-height: 60px;
    padding: $spacing-sm $spacing-md;
    border: 1px solid $color-border;
    border-radius: $radius-base;

    &:focus { border-color: $color-primary; box-shadow: 0 0 0 2px rgba($color-primary, 0.12); }
  }

  &__prefix, &__suffix {
    display: inline-flex;
    align-items: center;
    color: $color-text-secondary;
    flex-shrink: 0;
  }
  &__prefix { padding-left: $spacing-sm; }
  &__suffix { padding-right: $spacing-sm; }

  &__clear {
    display: inline-flex;
    align-items: center;
    padding: 0 $spacing-sm;
    cursor: pointer;
    color: $color-text-disabled;
    transition: color $transition-fast;
    &:hover { color: $color-text-secondary; }
  }

  &--size-small {
    .v-input__inner { height: 28px; }
    .v-input__native { padding: 0 $spacing-sm; font-size: $font-size-xs; }
  }
  &--size-medium {
    .v-input__inner { height: 36px; }
    .v-input__native { padding: 0 $spacing-md; font-size: $font-size-base; }
  }
  &--size-large {
    .v-input__inner { height: 44px; }
    .v-input__native { padding: 0 $spacing-base; font-size: $font-size-lg; }
  }

  &--disabled {
    .v-input__inner { background: $color-bg-disabled; cursor: not-allowed; }
    .v-input__native { cursor: not-allowed; color: $color-text-disabled; }
  }
}
</style>
