import { type PropType, type ExtractPropTypes } from 'vue';

/**
 * 泛型树节点类型
 * T 代表节点携带的额外数据类型
 */
export interface TreeNode<T = Record<string, unknown>> {
  key: string | number;
  label: string;
  children?: TreeNode<T>[];
  disabled?: boolean;
  isLeaf?: boolean;
  /** 节点附带的业务数据 */
  data?: T;
  icon?: string;
}

export interface TreeProps<T = Record<string, unknown>> {
  data: TreeNode<T>[];
  defaultExpandAll?: boolean;
  expandedKeys?: (string | number)[];
  selectedKeys?: (string | number)[];
  checkable?: boolean;
  checkedKeys?: (string | number)[];
  showLine?: boolean;
  blockNode?: boolean;
  draggable?: boolean;
  expandOnClick?: boolean;
  multiple?: boolean;
}

export const treeProps = {
  data: { type: Array as PropType<TreeNode[]>, required: true },
  defaultExpandAll: { type: Boolean, default: false },
  expandedKeys: { type: Array as PropType<(string | number)[]>, default: () => [] },
  selectedKeys: { type: Array as PropType<(string | number)[]>, default: () => [] },
  checkable: { type: Boolean, default: false },
  checkedKeys: { type: Array as PropType<(string | number)[]>, default: () => [] },
  showLine: { type: Boolean, default: false },
  blockNode: { type: Boolean, default: false },
  draggable: { type: Boolean, default: false },
  expandOnClick: { type: Boolean, default: true },
  multiple: { type: Boolean, default: false },
} as const;

export type TreePropsType = ExtractPropTypes<typeof treeProps>;

export interface TreeEmits {
  (e: 'update:expandedKeys', keys: (string | number)[]): void;
  (e: 'update:selectedKeys', keys: (string | number)[]): void;
  (e: 'update:checkedKeys', keys: (string | number)[]): void;
  (e: 'select', keys: (string | number)[], node: TreeNode): void;
  (e: 'expand', keys: (string | number)[], node: TreeNode): void;
  (e: 'check', keys: (string | number)[], node: TreeNode): void;
}
