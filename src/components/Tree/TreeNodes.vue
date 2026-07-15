<template>
  <ul class="v-tree-nodes" role="group">
    <li v-for="node in nodes" :key="node.key" class="v-tree-node" :class="{ 'v-tree-node--disabled': node.disabled }">
      <div
        :class="nodeClasses(node)"
        :style="{ paddingLeft: `${level * 24 + 8}px` }"
        @click="handleNodeClick(node)"
      >
        <!-- Expand icon -->
        <span
          :class="['v-tree-node__expand', { 'v-tree-node__expand--open': isExpanded(node.key), 'v-tree-node__expand--leaf': !hasChildren(node) }]"
          @click.stop="handleToggle(node)"
        >
          <svg v-if="hasChildren(node)" viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
            <path d="M6 4l4 4-4 4z" />
          </svg>
        </span>

        <!-- Checkbox -->
        <label v-if="checkable" class="v-tree-node__checkbox" @click.stop>
          <input
            type="checkbox"
            :checked="isChecked(node.key)"
            :disabled="node.disabled"
            @change="handleCheck(node)"
          />
          <span class="v-tree-node__checkbox-indicator" />
        </label>

        <!-- Label -->
        <span :class="['v-tree-node__label', { 'v-tree-node__label--selected': isSelected(node.key) }]">
          <slot :name="`node-${node.key}`" :node="node">{{ node.label }}</slot>
        </span>
      </div>

      <!-- Children -->
      <Transition name="tree-expand">
        <TreeNodes
          v-if="hasChildren(node) && isExpanded(node.key)"
          :nodes="node.children!"
          :expanded-keys="expandedKeys"
          :selected-keys="selectedKeys"
          :checked-keys="checkedKeys"
          :checkable="checkable"
          :level="level + 1"
          :expand-on-click="expandOnClick"
          :draggable="draggable"
          @toggle="(n: TreeNode) => $emit('toggle', n)"
          @select="(n: TreeNode) => $emit('select', n)"
          @check="(n: TreeNode) => $emit('check', n)"
        />
      </Transition>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { TreeNode } from './types';

defineOptions({ name: 'TreeNodes' });

const props = defineProps<{
  nodes: TreeNode[];
  expandedKeys: (string | number)[];
  selectedKeys: (string | number)[];
  checkedKeys: (string | number)[];
  checkable: boolean;
  level: number;
  expandOnClick: boolean;
  draggable: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle', node: TreeNode): void;
  (e: 'select', node: TreeNode): void;
  (e: 'check', node: TreeNode): void;
}>();

function hasChildren(node: TreeNode): boolean {
  return !!(node.children && node.children.length > 0);
}

function isExpanded(key: string | number): boolean {
  return props.expandedKeys.includes(key);
}

function isSelected(key: string | number): boolean {
  return props.selectedKeys.includes(key);
}

function isChecked(key: string | number): boolean {
  return props.checkedKeys.includes(key);
}

function nodeClasses(node: TreeNode): Record<string, boolean> {
  return {
    'v-tree-node__content': true,
    'v-tree-node__content--selected': props.selectedKeys.includes(node.key),
    'v-tree-node__content--disabled': !!node.disabled,
  };
}

function handleToggle(node: TreeNode): void {
  if (hasChildren(node) && !node.disabled) {
    emit('toggle', node);
  }
}

function handleNodeClick(node: TreeNode): void {
  if (node.disabled) return;
  if (props.expandOnClick && hasChildren(node)) {
    emit('toggle', node);
  }
  emit('select', node);
}

function handleCheck(node: TreeNode): void {
  if (!node.disabled) emit('check', node);
}
</script>

<style lang="scss" scoped>
.v-tree-nodes {
  list-style: none;
  padding: 0;
  margin: 0;
}

.v-tree-node {
  &__content {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: $radius-sm;
    cursor: pointer;
    transition: background $transition-fast;

    &:hover { background: $color-bg-hover; }
    &--selected { background: rgba($color-primary, 0.08); }
    &--disabled { cursor: not-allowed; opacity: 0.5; }
  }

  &__expand {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    transition: transform $transition-fast;
    color: $color-text-secondary;

    svg { transition: transform $transition-fast; }
    &--open svg { transform: rotate(90deg); }
    &--leaf { visibility: hidden; }
  }

  &__checkbox {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    flex-shrink: 0;

    input { display: none; }

    &-indicator {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 1.5px solid $color-border;
      border-radius: 3px;
      transition: all $transition-fast;
      position: relative;

      input:checked + & {
        background: $color-primary;
        border-color: $color-primary;

        &::after {
          content: '';
          position: absolute;
          left: 4px;
          top: 1px;
          width: 5px;
          height: 9px;
          border: solid #fff;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
      }
    }
  }

  &__label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: $font-size-base;
    line-height: 1.5;

    &--selected { color: $color-primary; font-weight: 500; }
  }
}

.tree-expand-enter-active, .tree-expand-leave-active {
  overflow: hidden;
  transition: all $transition-base;
}
.tree-expand-enter-from, .tree-expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.tree-expand-enter-to, .tree-expand-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
