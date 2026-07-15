import { type PropType, type ExtractPropTypes } from 'vue';

/**
 * 泛型上传文件类型
 * T 代表上传成功后的响应数据类型
 */
export interface UploadFile<T = unknown> {
  uid: string;
  name: string;
  size: number;
  type: string;
  status: 'ready' | 'uploading' | 'success' | 'error';
  percent?: number;
  raw?: File;
  response?: T;
}

export type UploadTrigger = 'click' | 'drag';

export interface UploadProps<T = unknown> {
  action?: string;
  accept?: string;
  multiple?: boolean;
  limit?: number;
  maxSize?: number;
  disabled?: boolean;
  drag?: boolean;
  fileList?: UploadFile<T>[];
  autoUpload?: boolean;
  headers?: Record<string, string>;
  data?: Record<string, string>;
  name?: string;
}

export const uploadProps = {
  action: { type: String, default: '' },
  accept: { type: String, default: '' },
  multiple: { type: Boolean, default: false },
  limit: { type: Number, default: undefined },
  maxSize: { type: Number, default: undefined },
  disabled: { type: Boolean, default: false },
  drag: { type: Boolean, default: false },
  fileList: { type: Array as PropType<UploadFile[]>, default: () => [] },
  autoUpload: { type: Boolean, default: true },
  headers: { type: Object as PropType<Record<string, string>>, default: () => ({}) },
  data: { type: Object as PropType<Record<string, string>>, default: () => ({}) },
  name: { type: String, default: 'file' },
} as const;

export type UploadPropsType = ExtractPropTypes<typeof uploadProps>;

export interface UploadEmits<T = unknown> {
  (e: 'update:fileList', files: UploadFile<T>[]): void;
  (e: 'change', file: UploadFile<T>, fileList: UploadFile<T>[]): void;
  (e: 'success', response: T, file: UploadFile<T>): void;
  (e: 'error', error: Error, file: UploadFile<T>): void;
  (e: 'exceed', files: File[], fileList: UploadFile<T>[]): void;
  (e: 'remove', file: UploadFile<T>): void;
}
