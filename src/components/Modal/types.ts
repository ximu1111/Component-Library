import { type PropType, type ExtractPropTypes } from 'vue';

export type ModalSize = 'small' | 'medium' | 'large';

export interface ModalProps {
  modelValue: boolean;
  title?: string;
  size?: ModalSize;
  closable?: boolean;
  maskClosable?: boolean;
  showFooter?: boolean;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  width?: string | number;
  top?: string;
  destroyOnClose?: boolean;
}

export const modalProps = {
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: '' },
  size: { type: String as PropType<ModalSize>, default: 'medium' },
  closable: { type: Boolean, default: true },
  maskClosable: { type: Boolean, default: true },
  showFooter: { type: Boolean, default: true },
  confirmText: { type: String, default: '确定' },
  cancelText: { type: String, default: '取消' },
  loading: { type: Boolean, default: false },
  width: { type: [String, Number] as PropType<string | number>, default: undefined },
  top: { type: String, default: '15vh' },
  destroyOnClose: { type: Boolean, default: false },
} as const;

export type ModalPropsType = ExtractPropTypes<typeof modalProps>;

export interface ModalEmits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
  (e: 'open'): void;
  (e: 'close'): void;
}
