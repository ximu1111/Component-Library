<template>
  <div :class="['v-tree', { 'v-tree--show-line': showLine, 'v-tree--block': blockNode }]" role="tree" v-bind="$attrs">
    <TreeNodes
      :nodes="data"
      :expanded-keys="internalExpandedKeys"
      :selected-keys="selectedKeys"
      :checked-keys="checkedKeys"
      :checkable="checkable"
      :level="0"
      :expand-on-click="expandOnClick"
      :draggable="draggable"
      @toggle="handleToggle"
      @select="handleSelect"
      @check="handleCheck"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { treeProps, type TreeNode } from './types';
import TreeNodes from './TreeNodes.vue';

defineOptions({ name: 'VTree', inheritAttrs: false });

const props = defineProps(treeProps);
const emit = defineEmits<{
  (e: 'update:expandedKeys', keys: (string | number)[]): void;
  (e: 'update:selectedKeys', keys: (string | number)[]): void;
  (e: 'update:checkedKeys', keys: (string | number)[]): void;
  (e: 'select', keys: (string | number)[], node: TreeNode): void;
  (e: 'expand', keys: (string | number)[], node: TreeNode): void;
  (e: 'check', keys: (string | number)[], node: TreeNode): void;
}>();

/** 收集所有节点 key */
function collectAllKeys(nodes: TreeNode[]): (string | number)[] {
  const keys: (string | number)[] = [];
  function walk(list: TreeNode[]): void {
    for (const n of list) {
      keys.push(n.key);
      if (n.children) walk(n.children);
    }
  }
  walk(nodes);
  return keys;
}

const internalExpandedKeys = ref<(string | number)[]>(
  props.defaultExpandAll ? collectAllKeys(props.data) : [...props.expandedKeys]
);

watch(() => props.expandedKeys, (val) => {
  internalExpandedKeys.value = [...val];
});

watch(() => props.data, (val) => {
  if (props.defaultExpandAll) {
    internalExpandedKeys.value = collectAllKeys(val);
  }
}, { deep: true });

function handleToggle(node: TreeNode): void {
  const keys = [...internalExpandedKeys.value];
  const idx = keys.indexOf(node.key);
  if (idx >= 0) {
    keys.splice(idx, 1);
  } else {
    keys.push(node.key);
  }
  internalExpandedKeys.value = keys;
  emit('update:expandedKeys', keys);
  emit('expand', keys, node);
}

function handleSelect(node: TreeNode): void {
  let keys: (string | number)[];
  if (props.multiple) {
    keys = [...props.selectedKeys];
    const idx = keys.indexOf(node.key);
    if (idx >= 0) keys.splice(idx, 1); else keys.push(node.key);
  } else {
    keys = props.selectedKeys.includes(node.key) ? [] : [node.key];
  }
  emit('update:selectedKeys', keys);
  emit('select', keys, node);
}

function handleCheck(node: TreeNode): void {
  const keys = [...props.checkedKeys];
  const idx = keys.indexOf(node.key);
  if (idx >= 0) keys.splice(idx, 1); else keys.push(node.key);
  emit('update:checkedKeys', keys);
  emit('check', keys, node);
}
</script>

<style lang="scss" scoped>
.v-tree {
  font-size: $font-size-base;
  color: $color-text;

  &--block {
    :deep(.v-tree-node__label) { width: 100%; }
  }
}
</style>
