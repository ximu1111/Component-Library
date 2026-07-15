<template>
  <div :class="['v-upload', { 'v-upload--disabled': disabled, 'v-upload--drag': drag }]" v-bind="$attrs">
    <div
      :class="['v-upload__trigger', { 'v-upload__trigger--drag': drag, 'v-upload__trigger--dragover': isDragover }]"
      @click="triggerFileInput"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <slot>
        <div class="v-upload__default">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          <span class="v-upload__text">点击或拖拽文件到此处上传</span>
        </div>
      </slot>
    </div>

    <input
      ref="inputRef"
      type="file"
      class="v-upload__input"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      @change="handleFileChange"
    />

    <div v-if="fileList.length > 0" class="v-upload__list">
      <div
        v-for="(file, index) in fileList"
        :key="file.uid"
        :class="['v-upload__item', `v-upload__item--${file.status}`]"
      >
        <span class="v-upload__item-name" :title="file.name">{{ file.name }}</span>
        <span class="v-upload__item-size">{{ formatSize(file.size) }}</span>
        <span :class="['v-upload__item-status', `v-upload__item-status--${file.status}`]">
          {{ statusText(file.status) }}
        </span>
        <button class="v-upload__item-remove" @click="handleRemove(index)">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { uploadProps, type UploadFile } from './types';

defineOptions({ name: 'VUpload', inheritAttrs: false });

const props = defineProps(uploadProps);
const emit = defineEmits<{
  (e: 'update:fileList', files: UploadFile[]): void;
  (e: 'change', file: UploadFile, fileList: UploadFile[]): void;
  (e: 'success', response: unknown, file: UploadFile): void;
  (e: 'error', error: Error, file: UploadFile): void;
  (e: 'exceed', files: File[], fileList: UploadFile[]): void;
  (e: 'remove', file: UploadFile): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const isDragover = ref(false);

let uidCounter = 0;
function genUid(): string {
  return `upload-${Date.now()}-${++uidCounter}`;
}

function triggerFileInput(): void {
  if (!props.disabled) inputRef.value?.click();
}

function handleDragOver(): void { isDragover.value = true; }
function handleDragLeave(): void { isDragover.value = false; }

function handleDrop(evt: DragEvent): void {
  isDragover.value = false;
  if (props.disabled || !props.drag) return;
  const files = Array.from(evt.dataTransfer?.files ?? []);
  processFiles(files);
}

function handleFileChange(evt: Event): void {
  const target = evt.target as HTMLInputElement;
  const files = Array.from(target.files ?? []);
  processFiles(files);
  target.value = '';
}

function processFiles(files: File[]): void {
  if (props.limit && props.fileList.length + files.length > props.limit) {
    emit('exceed', files, props.fileList);
    return;
  }

  const newFiles: UploadFile[] = files
    .filter(file => {
      if (props.maxSize && file.size > props.maxSize * 1024) return false;
      return true;
    })
    .map(file => ({
      uid: genUid(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'ready' as const,
      raw: file,
    }));

  const updatedList = [...props.fileList, ...newFiles];
  emit('update:fileList', updatedList);
  newFiles.forEach(f => emit('change', f, updatedList));

  if (props.autoUpload && props.action) {
    newFiles.forEach(f => uploadFile(f));
  }
}

async function uploadFile(file: UploadFile): Promise<void> {
  if (!props.action || !file.raw) return;

  const formData = new FormData();
  formData.append(props.name, file.raw);
  Object.entries(props.data).forEach(([k, v]) => formData.append(k, v));

  const updated = props.fileList.map(f =>
    f.uid === file.uid ? { ...f, status: 'uploading' as const } : f
  );
  emit('update:fileList', updated);

  try {
    const resp = await fetch(props.action, {
      method: 'POST',
      headers: props.headers,
      body: formData,
    });
    const data = await resp.json();
    const result = props.fileList.map(f =>
      f.uid === file.uid ? { ...f, status: 'success' as const, response: data } : f
    );
    emit('update:fileList', result);
    emit('success', data, { ...file, status: 'success', response: data });
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Upload failed');
    const result = props.fileList.map(f =>
      f.uid === file.uid ? { ...f, status: 'error' as const } : f
    );
    emit('update:fileList', result);
    emit('error', error, { ...file, status: 'error' });
  }
}

function handleRemove(index: number): void {
  const file = props.fileList[index];
  const updated = props.fileList.filter((_, i) => i !== index);
  emit('update:fileList', updated);
  emit('remove', file);
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function statusText(status: string): string {
  const map: Record<string, string> = { ready: '等待', uploading: '上传中', success: '成功', error: '失败' };
  return map[status] ?? '';
}
</script>

<style lang="scss" scoped>
.v-upload {
  &__input { display: none; }

  &__trigger {
    cursor: pointer;
    transition: border-color $transition-fast;

    &--drag {
      border: 2px dashed $color-border;
      border-radius: $radius-lg;
      padding: $spacing-2xl;
      text-align: center;
      transition: border-color $transition-fast;

      &:hover, &.v-upload__trigger--dragover { border-color: $color-primary; }
    }
  }

  &__default {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-sm;
    color: $color-text-secondary;
  }

  &__text { font-size: $font-size-sm; }

  &__list {
    margin-top: $spacing-md;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-sm;
    font-size: $font-size-sm;
    transition: background $transition-fast;

    &:hover { background: $color-bg-hover; }

    &-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: $color-text;
    }

    &-size { color: $color-text-disabled; font-size: $font-size-xs; flex-shrink: 0; }

    &-status {
      font-size: $font-size-xs;
      flex-shrink: 0;
      &--ready { color: $color-text-disabled; }
      &--uploading { color: $color-primary; }
      &--success { color: $color-success; }
      &--error { color: $color-danger; }
    }

    &-remove {
      display: inline-flex;
      border: none;
      background: transparent;
      cursor: pointer;
      color: $color-text-disabled;
      padding: 2px;
      border-radius: $radius-sm;
      transition: all $transition-fast;
      &:hover { color: $color-danger; background: rgba($color-danger, 0.08); }
    }
  }

  &--disabled {
    .v-upload__trigger { cursor: not-allowed; opacity: 0.6; }
  }
}
</style>
