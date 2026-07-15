import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { VInput } from '@/components/Input';

describe('VInput', () => {
  it('renders with placeholder', () => {
    const wrapper = mount(VInput, { props: { modelValue: '', placeholder: '请输入' } });
    expect(wrapper.find('input').attributes('placeholder')).toBe('请输入');
  });

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(VInput, { props: { modelValue: '' } });
    const input = wrapper.find('input');
    await input.setValue('hello');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hello']);
  });

  it('emits input event', async () => {
    const wrapper = mount(VInput, { props: { modelValue: '' } });
    const input = wrapper.find('input');
    await input.setValue('test');
    expect(wrapper.emitted('input')?.[0]).toEqual(['test']);
  });

  it('renders textarea when type is textarea', () => {
    const wrapper = mount(VInput, { props: { modelValue: '', type: 'textarea' } });
    expect(wrapper.find('textarea').exists()).toBe(true);
  });

  it('applies disabled state', () => {
    const wrapper = mount(VInput, { props: { modelValue: '', disabled: true } });
    expect(wrapper.find('input').attributes('disabled')).toBeDefined();
    expect(wrapper.classes()).toContain('v-input--disabled');
  });

  it('shows clear button when clearable and has value', () => {
    const wrapper = mount(VInput, { props: { modelValue: 'text', clearable: true } });
    expect(wrapper.find('.v-input__clear').exists()).toBe(true);
  });

  it('does not show clear button when value is empty', () => {
    const wrapper = mount(VInput, { props: { modelValue: '', clearable: true } });
    expect(wrapper.find('.v-input__clear').exists()).toBe(false);
  });

  it('emits clear event when clear button clicked', async () => {
    const wrapper = mount(VInput, { props: { modelValue: 'text', clearable: true } });
    await wrapper.find('.v-input__clear').trigger('click');
    expect(wrapper.emitted('clear')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
  });

  it('applies size class', () => {
    const wrapper = mount(VInput, { props: { modelValue: '', size: 'large' } });
    expect(wrapper.classes()).toContain('v-input--size-large');
  });

  it('passes through $attrs to input element', () => {
    const wrapper = mount(VInput, { props: { modelValue: '' }, attrs: { 'data-cy': 'my-input' } });
    expect(wrapper.find('input').attributes('data-cy')).toBe('my-input');
  });

  it('emits focus and blur events', async () => {
    const wrapper = mount(VInput, { props: { modelValue: '' } });
    const input = wrapper.find('input');
    await input.trigger('focus');
    expect(wrapper.emitted('focus')).toHaveLength(1);
    await input.trigger('blur');
    expect(wrapper.emitted('blur')).toHaveLength(1);
  });
});
