import { type PropType, type ExtractPropTypes } from 'vue';

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerProps {
  modelValue: boolean;
  title?: string;
  placement?: DrawerPlacement;
  size?: string | number;
  closable?: boolean;
  maskClosable?: boolean;
  destroyOnClose?: boolean;
  showFooter?: boolean;
}

export const drawerProps = {
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: '' },
  placement: {
    type: String as PropType<DrawerPlacement>,
    default: 'right',
    validator: (v: string) => ['left', 'right', 'top', 'bottom'].includes(v),
  },
  size: { type: [String, Number] as PropType<string | number>, default: 300 },
  closable: { type: Boolean, default: true },
  maskClosable: { type: Boolean, default: true },
  destroyOnClose: { type: Boolean, default: false },
  showFooter: { type: Boolean, default: false },
} as const;

export type DrawerPropsType = ExtractPropTypes<typeof drawerProps>;

export interface DrawerEmits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'open'): void;
  (e: 'close'): void;
}
