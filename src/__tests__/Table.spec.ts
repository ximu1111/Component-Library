import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { VTable } from '@/components/Table';
import type { TableColumn } from '@/components/Table';

type TestRow = { id: number; name: string; [key: string]: unknown };

const columns: TableColumn<TestRow>[] = [
  { key: 'id', title: 'ID', dataIndex: 'id' },
  { key: 'name', title: 'Name', dataIndex: 'name' },
];

const data: TestRow[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

describe('VTable', () => {
  it('renders column headers', () => {
    const wrapper = mount(VTable, { props: { columns, data } });
    const ths = wrapper.findAll('.v-table__th');
    expect(ths).toHaveLength(2);
    expect(ths[0].text()).toContain('ID');
    expect(ths[1].text()).toContain('Name');
  });

  it('renders data rows', () => {
    const wrapper = mount(VTable, { props: { columns, data } });
    const rows = wrapper.findAll('.v-table__row');
    expect(rows).toHaveLength(2);
  });

  it('renders empty text when no data', () => {
    const wrapper = mount(VTable, { props: { columns, data: [], emptyText: '没有数据' } });
    expect(wrapper.find('.v-table__empty').text()).toBe('没有数据');
  });

  it('emits sort-change on sortable column click', async () => {
    const sortableCols: TableColumn<TestRow>[] = [
      { key: 'id', title: 'ID', dataIndex: 'id', sortable: true },
    ];
    const wrapper = mount(VTable, { props: { columns: sortableCols, data } });
    await wrapper.find('.v-table__th--sortable').trigger('click');
    expect(wrapper.emitted('sort-change')?.[0]).toEqual([{ key: 'id', order: 'asc' }]);
  });

  it('emits row-click when row is clicked', async () => {
    const wrapper = mount(VTable, { props: { columns, data } });
    await wrapper.findAll('.v-table__row')[0].trigger('click');
    expect(wrapper.emitted('row-click')?.[0]).toEqual([{ id: 1, name: 'Alice' }, 0]);
  });

  it('applies bordered class', () => {
    const wrapper = mount(VTable, { props: { columns, data, bordered: true } });
    expect(wrapper.classes()).toContain('v-table--bordered');
  });

  it('applies striped class to odd rows', () => {
    const wrapper = mount(VTable, { props: { columns, data, striped: true } });
    const rows = wrapper.findAll('.v-table__row');
    expect(rows[1].classes()).toContain('v-table__row--striped');
  });

  it('shows loading overlay', () => {
    const wrapper = mount(VTable, { props: { columns, data, loading: true } });
    expect(wrapper.find('.v-table__loading').exists()).toBe(true);
  });
});
