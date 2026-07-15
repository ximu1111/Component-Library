import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { VButton } from '@/components/Button';

describe('VButton', () => {
  it('renders default slot content', () => {
    const wrapper = mount(VButton, { slots: { default: '点击我' } });
    expect(wrapper.text()).toContain('点击我');
  });

  it('applies type class correctly', () => {
    const wrapper = mount(VButton, { props: { type: 'primary' } });
    expect(wrapper.classes()).toContain('v-btn--type-primary');
  });

  it('applies size class correctly', () => {
    const wrapper = mount(VButton, { props: { size: 'large' } });
    expect(wrapper.classes()).toContain('v-btn--size-large');
  });

  it('emits click event', async () => {
    const wrapper = mount(VButton);
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('does not emit click when disabled', async () => {
    const wrapper = mount(VButton, { props: { disabled: true } });
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
  });

  it('does not emit click when loading', async () => {
    const wrapper = mount(VButton, { props: { loading: true } });
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
  });

  it('shows loading indicator when loading', () => {
    const wrapper = mount(VButton, { props: { loading: true } });
    expect(wrapper.find('.btn__loading-icon').exists()).toBe(true);
  });

  it('applies round class when round prop is true', () => {
    const wrapper = mount(VButton, { props: { round: true } });
    expect(wrapper.classes()).toContain('v-btn--round');
  });

  it('applies plain class when plain prop is true', () => {
    const wrapper = mount(VButton, { props: { plain: true, type: 'primary' } });
    expect(wrapper.classes()).toContain('v-btn--plain');
  });

  it('passes through native attributes via $attrs', () => {
    const wrapper = mount(VButton, { attrs: { 'data-testid': 'btn-1' } });
    expect(wrapper.attributes('data-testid')).toBe('btn-1');
  });

  it('sets native type attribute', () => {
    const wrapper = mount(VButton, { props: { nativeType: 'submit' } });
    expect(wrapper.attributes('type')).toBe('submit');
  });
});
