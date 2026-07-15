import { type PropType, type ExtractPropTypes } from 'vue';

/** 按钮尺寸 */
export type ButtonSize = 'small' | 'medium' | 'large';

/** 按钮类型 / 视觉风格 */
export type ButtonType = 'default' | 'primary' | 'success' | 'warning' | 'danger';

/** 原生 button 类型 */
export type ButtonNativeType = 'button' | 'submit' | 'reset';

/**
 * Button 组件 Props 类型定义
 * 使用 interface + ExtractPropTypes 实现类型推导
 */
export const buttonProps = {
  /** 按钮类型 */
  type: {
    type: String as PropType<ButtonType>,
    default: 'default',
    validator: (val: string): boolean => ['default', 'primary', 'success', 'warning', 'danger'].includes(val),
  },
  /** 按钮尺寸 */
  size: {
    type: String as PropType<ButtonSize>,
    default: 'medium',
    validator: (val: string): boolean => ['small', 'medium', 'large'].includes(val),
  },
  /** 是否禁用 */
  disabled: { type: Boolean, default: false },
  /** 是否加载中 */
  loading: { type: Boolean, default: false },
  /** 是否为朴素按钮 */
  plain: { type: Boolean, default: false },
  /** 是否为圆角按钮 */
  round: { type: Boolean, default: false },
  /** 是否为圆形按钮 */
  circle: { type: Boolean, default: false },
  /** 原生 type */
  nativeType: {
    type: String as PropType<ButtonNativeType>,
    default: 'button',
  },
} as const;

export type ButtonProps = ExtractPropTypes<typeof buttonProps>;

/**
 * Button 组件事件类型推导
 * 使用 TypeScript 泛型定义 emits 类型
 */
export interface ButtonEmits {
  (e: 'click', event: MouseEvent): void;
}

/** emits 声明数组，用于 defineEmits */
export const buttonEmits = ['click'] as const;
