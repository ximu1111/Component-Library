import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { VTree } from '@/components/Tree';
import type { TreeNode } from '@/components/Tree';

const treeData: TreeNode[] = [
  {
    key: '1', label: 'Node 1', children: [
      { key: '1-1', label: 'Node 1-1' },
      { key: '1-2', label: 'Node 1-2' },
    ],
  },
  { key: '2', label: 'Node 2' },
];

describe('VTree', () => {
  it('renders root nodes', () => {
    const wrapper = mount(VTree, { props: { data: treeData } });
    const nodes = wrapper.findAll('.v-tree-node');
    expect(nodes.length).toBeGreaterThanOrEqual(2);
  });

  it('renders node labels', () => {
    const wrapper = mount(VTree, { props: { data: treeData } });
    expect(wrapper.text()).toContain('Node 1');
    expect(wrapper.text()).toContain('Node 2');
  });

  it('expands all nodes when defaultExpandAll is true', () => {
    const wrapper = mount(VTree, { props: { data: treeData, defaultExpandAll: true } });
    expect(wrapper.text()).toContain('Node 1-1');
    expect(wrapper.text()).toContain('Node 1-2');
  });

  it('emits select event on node click', async () => {
    const wrapper = mount(VTree, {
      props: { data: treeData, selectedKeys: [], expandedKeys: [] },
    });
    const nodeContent = wrapper.find('.v-tree-node__content');
    await nodeContent.trigger('click');
    expect(wrapper.emitted('select')).toBeTruthy();
  });

  it('renders checkboxes when checkable', () => {
    const wrapper = mount(VTree, { props: { data: treeData, checkable: true } });
    expect(wrapper.find('.v-tree-node__checkbox').exists()).toBe(true);
  });

  it('emits check event when checkbox toggled', async () => {
    const wrapper = mount(VTree, {
      props: { data: treeData, checkable: true, checkedKeys: [] },
    });
    const checkbox = wrapper.find('.v-tree-node__checkbox input');
    await checkbox.setValue(true);
    expect(wrapper.emitted('check')).toBeTruthy();
  });
});
