<template>
  <Teleport to="body">
    <Transition name="drawer-fade">
      <div v-if="modelValue" class="v-drawer__wrapper" @click.self="handleMaskClick">
        <div class="v-drawer__mask" />
        <Transition :name="transitionName">
          <div
            v-if="modelValue"
            :class="drawerClasses"
            :style="drawerStyle"
            role="dialog"
            aria-modal="true"
            :aria-label="title"
            v-bind="$attrs"
          >
            <div v-if="title || closable" class="v-drawer__header">
              <slot name="header">
                <h3 class="v-drawer__title">{{ title }}</h3>
              </slot>
              <button v-if="closable" class="v-drawer__close" aria-label="关闭" @click="handleClose">
                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                  <path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z"/>
                </svg>
              </button>
            </div>

            <div class="v-drawer__body">
              <slot />
            </div>

            <div v-if="showFooter" class="v-drawer__footer">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { drawerProps } from './types';

defineOptions({ name: 'VDrawer', inheritAttrs: false });

const props = defineProps(drawerProps);
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'open'): void;
  (e: 'close'): void;
}>();

const isHorizontal = computed(() => props.placement === 'left' || props.placement === 'right');

const drawerClasses = computed(() => [
  'v-drawer',
  `v-drawer--${props.placement}`,
]);

const drawerStyle = computed(() => {
  const sizeVal = typeof props.size === 'number' ? `${props.size}px` : props.size;
  return isHorizontal.value
    ? { width: sizeVal, height: '100%' }
    : { height: sizeVal, width: '100%' };
});

const transitionName = computed(() => `drawer-slide-${props.placement}`);

function handleClose(): void {
  emit('update:modelValue', false);
  emit('close');
}

function handleMaskClick(): void {
  if (props.maskClosable) handleClose();
}

watch(() => props.modelValue, (val) => {
  if (val) emit('open');
});
</script>

<style lang="scss" scoped>
.v-drawer {
  &__wrapper {
    position: fixed;
    inset: 0;
    z-index: $z-drawer;
  }

  &__mask {
    position: fixed;
    inset: 0;
    background: $color-overlay;
  }

  position: fixed;
  background: $color-bg;
  box-shadow: $shadow-lg;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &--right { top: 0; right: 0; }
  &--left { top: 0; left: 0; }
  &--top { top: 0; left: 0; }
  &--bottom { bottom: 0; left: 0; }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-base $spacing-xl;
    border-bottom: 1px solid $color-border-light;
    flex-shrink: 0;
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
    flex: 1;
    padding: $spacing-xl;
    overflow-y: auto;
  }

  &__footer {
    padding: $spacing-base $spacing-xl;
    border-top: 1px solid $color-border-light;
    flex-shrink: 0;
  }
}

/* Transitions */
.drawer-fade-enter-active, .drawer-fade-leave-active { transition: opacity $transition-base; }
.drawer-fade-enter-from, .drawer-fade-leave-to { opacity: 0; }

.drawer-slide-right-enter-active, .drawer-slide-right-leave-active { transition: transform $transition-slow; }
.drawer-slide-right-enter-from, .drawer-slide-right-leave-to { transform: translateX(100%); }

.drawer-slide-left-enter-active, .drawer-slide-left-leave-active { transition: transform $transition-slow; }
.drawer-slide-left-enter-from, .drawer-slide-left-leave-to { transform: translateX(-100%); }

.drawer-slide-top-enter-active, .drawer-slide-top-leave-active { transition: transform $transition-slow; }
.drawer-slide-top-enter-from, .drawer-slide-top-leave-to { transform: translateY(-100%); }

.drawer-slide-bottom-enter-active, .drawer-slide-bottom-leave-active { transition: transform $transition-slow; }
.drawer-slide-bottom-enter-from, .drawer-slide-bottom-leave-to { transform: translateY(100%); }
</style>
