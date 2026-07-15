import { type PropType, type ExtractPropTypes } from 'vue';

/** 输入框尺寸 */
export type InputSize = 'small' | 'medium' | 'large';

/**
 * Input 组件 Props - 使用 interface 定义泛型约束
 * T 代表 modelValue 的类型，支持 string | number
 */
export interface InputProps<T extends string | number = string> {
  modelValue: T;
  type?: 'text' | 'password' | 'number' | 'textarea';
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  size?: InputSize;
  maxlength?: number;
  rows?: number;
  prefixIcon?: string;
  suffixIcon?: string;
}

export const inputProps = {
  modelValue: { type: [String, Number] as PropType<string | number>, required: true },
  type: { type: String as PropType<InputProps['type']>, default: 'text' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  size: { type: String as PropType<InputSize>, default: 'medium' },
  maxlength: { type: Number, default: undefined },
  rows: { type: Number, default: 3 },
} as const;

export type InputPropsType = ExtractPropTypes<typeof inputProps>;

/** 事件类型定义 */
export interface InputEmits {
  (e: 'update:modelValue', value: string | number): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'change', value: string | number): void;
  (e: 'clear'): void;
  (e: 'input', value: string | number): void;
}
