<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="v-modal__wrapper" @click.self="handleMaskClick">
        <div class="v-modal__mask" />
        <div
          :class="modalClasses"
          :style="modalStyle"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
          v-bind="$attrs"
        >
          <div v-if="title || closable" class="v-modal__header">
            <slot name="header">
              <h3 class="v-modal__title">{{ title }}</h3>
            </slot>
            <button v-if="closable" class="v-modal__close" aria-label="关闭" @click="handleClose">
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                <path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z"/>
              </svg>
            </button>
          </div>

          <div class="v-modal__body">
            <slot />
          </div>

          <div v-if="showFooter" class="v-modal__footer">
            <slot name="footer">
              <button class="v-modal__btn v-modal__btn--cancel" @click="handleCancel">{{ cancelText }}</button>
              <button class="v-modal__btn v-modal__btn--confirm" :disabled="loading" @click="handleConfirm">
                <span v-if="loading" class="v-modal__btn-loading" />
                {{ confirmText }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { modalProps } from './types';

defineOptions({ name: 'VModal', inheritAttrs: false });

const props = defineProps(modalProps);
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
  (e: 'open'): void;
  (e: 'close'): void;
}>();

const modalClasses = computed(() => [
  'v-modal',
  `v-modal--size-${props.size}`,
]);

const modalStyle = computed(() => {
  const style: Record<string, string> = { top: props.top };
  if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width;
  }
  return style;
});

function handleClose(): void {
  emit('update:modelValue', false);
  emit('close');
}

function handleMaskClick(): void {
  if (props.maskClosable) handleClose();
}

function handleCancel(): void {
  emit('cancel');
  handleClose();
}

function handleConfirm(): void {
  emit('confirm');
}

watch(() => props.modelValue, (val) => {
  if (val) emit('open');
});
</script>

<style lang="scss" scoped>
.v-modal {
  &__wrapper {
    position: fixed;
    inset: 0;
    z-index: $z-modal;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    overflow-y: auto;
  }

  &__mask {
    position: fixed;
    inset: 0;
    background: $color-overlay;
  }

  position: relative;
  background: $color-bg;
  border-radius: $radius-lg;
  box-shadow: $shadow-lg;
  margin-top: v-bind('modalStyle.top');
  width: 100%;

  &--size-small { max-width: 400px; }
  &--size-medium { max-width: 560px; }
  &--size-large { max-width: 720px; }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-base $spacing-xl;
    border-bottom: 1px solid $color-border-light;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $color-text;
    margin: 0;
  }

  &__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    border-radius: $radius-sm;
    cursor: pointer;
    color: $color-text-secondary;
    transition: all $transition-fast;
    &:hover { background: $color-bg-hover; color: $color-text; }
  }

  &__body {
    padding: $spacing-xl;
    font-size: $font-size-base;
    color: $color-text;
    line-height: 1.6;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: $spacing-sm;
    padding: $spacing-base $spacing-xl;
    border-top: 1px solid $color-border-light;
  }

  &__btn {
    padding: $spacing-sm $spacing-base;
    border-radius: $radius-base;
    font-size: $font-size-base;
    cursor: pointer;
    transition: all $transition-fast;
    border: 1px solid $color-border;
    display: inline-flex;
    align-items: center;
    gap: 6px;

    &--cancel {
      background: $color-bg;
      color: $color-text;
      &:hover { border-color: $color-primary; color: $color-primary; }
    }
    &--confirm {
      background: $color-primary;
      color: #fff;
      border-color: $color-primary;
      &:hover { background: $color-primary-light; }
      &:disabled { opacity: 0.6; cursor: not-allowed; }
    }

    &-loading {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
  }
}

@keyframes spin { to { transform: rotate(360deg); } }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity $transition-base; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
