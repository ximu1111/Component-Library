import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { VPagination } from '@/components/Pagination';

describe('VPagination', () => {
  const defaultProps = { modelValue: 1, total: 100, pageSize: 10 };

  it('renders page buttons', () => {
    const wrapper = mount(VPagination, { props: defaultProps });
    const pages = wrapper.findAll('.v-pagination__page');
    expect(pages.length).toBeGreaterThan(0);
  });

  it('highlights current page', () => {
    const wrapper = mount(VPagination, { props: { ...defaultProps, modelValue: 3 } });
    const active = wrapper.find('.v-pagination__page--active');
    expect(active.text()).toBe('3');
  });

  it('emits update:modelValue on page click', async () => {
    const wrapper = mount(VPagination, { props: defaultProps });
    const pages = wrapper.findAll('.v-pagination__page');
    const page2 = pages.find(p => p.text() === '2');
    await page2!.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2]);
  });

  it('disables prev button on first page', () => {
    const wrapper = mount(VPagination, { props: defaultProps });
    expect(wrapper.find('.v-pagination__prev').attributes('disabled')).toBeDefined();
  });

  it('disables next button on last page', () => {
    const wrapper = mount(VPagination, { props: { modelValue: 10, total: 100, pageSize: 10 } });
    expect(wrapper.find('.v-pagination__next').attributes('disabled')).toBeDefined();
  });

  it('shows total when layout includes total', () => {
    const wrapper = mount(VPagination, { props: { ...defaultProps, layout: ['total', 'prev', 'pager', 'next'] } });
    expect(wrapper.find('.v-pagination__total').text()).toContain('100');
  });

  it('shows ellipsis for large page counts', () => {
    const wrapper = mount(VPagination, { props: { modelValue: 5, total: 200, pageSize: 10 } });
    const dots = wrapper.findAll('.v-pagination__page').filter(p => p.text() === '...');
    expect(dots.length).toBeGreaterThan(0);
  });

  it('emits change event on page change', async () => {
    const wrapper = mount(VPagination, { props: defaultProps });
    const pages = wrapper.findAll('.v-pagination__page');
    const page3 = pages.find(p => p.text() === '3');
    await page3!.trigger('click');
    expect(wrapper.emitted('change')?.[0]).toEqual([3, 10]);
  });
});
