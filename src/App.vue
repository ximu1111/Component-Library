<template>
  <div class="demo-app">
    <header class="demo-header">
      <h1>Vue Component Library</h1>
      <p>8 个通用组件 · TypeScript 泛型 · v-model 双向绑定 · attrs 透传 · 样式隔离</p>
    </header>

    <main class="demo-main">
      <!-- Button -->
      <section class="demo-section">
        <h2>Button 按钮</h2>
        <div class="demo-row">
          <VButton type="default" @click="log('default')">默认</VButton>
          <VButton type="primary" @click="log('primary')">主要</VButton>
          <VButton type="success" @click="log('success')">成功</VButton>
          <VButton type="warning" @click="log('warning')">警告</VButton>
          <VButton type="danger" @click="log('danger')">危险</VButton>
        </div>
        <div class="demo-row">
          <VButton type="primary" plain>朴素</VButton>
          <VButton type="primary" round>圆角</VButton>
          <VButton type="primary" loading>加载中</VButton>
          <VButton type="primary" disabled>禁用</VButton>
        </div>
        <div class="demo-row">
          <VButton type="primary" size="small">小型</VButton>
          <VButton type="primary" size="medium">中等</VButton>
          <VButton type="primary" size="large">大型</VButton>
        </div>
      </section>

      <!-- Input -->
      <section class="demo-section">
        <h2>Input 输入框</h2>
        <div class="demo-col">
          <VInput v-model="inputVal" placeholder="请输入内容" clearable />
          <VInput v-model="inputVal2" type="textarea" placeholder="多行文本输入" :rows="3" />
          <VInput v-model="inputVal3" placeholder="小型输入框" size="small" />
          <VInput v-model="inputVal4" placeholder="禁用状态" disabled />
        </div>
        <p class="demo-info">输入值: {{ inputVal }}</p>
      </section>

      <!-- Modal -->
      <section class="demo-section">
        <h2>Modal 弹窗</h2>
        <div class="demo-row">
          <VButton type="primary" @click="showModal = true">打开弹窗</VButton>
          <VButton @click="showModalSmall = true">小弹窗</VButton>
        </div>
        <VModal v-model="showModal" title="标题" @confirm="handleConfirm" @cancel="handleCancel">
          <p>这是一个弹窗的内容区域。支持 v-model 双向绑定、Teleport 传送到 body、attrs 透传。</p>
        </VModal>
        <VModal v-model="showModalSmall" title="小弹窗" size="small" :show-footer="false">
          <p>这是一个小型弹窗，没有底部按钮。</p>
        </VModal>
      </section>

      <!-- Drawer -->
      <section class="demo-section">
        <h2>Drawer 抽屉</h2>
        <div class="demo-row">
          <VButton type="primary" @click="drawerRight = true">右侧抽屉</VButton>
          <VButton @click="drawerLeft = true">左侧抽屉</VButton>
          <VButton @click="drawerTop = true">顶部抽屉</VButton>
          <VButton @click="drawerBottom = true">底部抽屉</VButton>
        </div>
        <VDrawer v-model="drawerRight" title="右侧抽屉">
          <p>这是右侧抽屉的内容。</p>
        </VDrawer>
        <VDrawer v-model="drawerLeft" title="左侧抽屉" placement="left">
          <p>这是左侧抽屉的内容。</p>
        </VDrawer>
        <VDrawer v-model="drawerTop" title="顶部抽屉" placement="top" :size="200">
          <p>这是顶部抽屉的内容。</p>
        </VDrawer>
        <VDrawer v-model="drawerBottom" title="底部抽屉" placement="bottom" :size="200">
          <p>这是底部抽屉的内容。</p>
        </VDrawer>
      </section>

      <!-- Table + Pagination -->
      <section class="demo-section">
        <h2>Table 表格 + Pagination 分页</h2>
        <VTable
          :columns="tableColumns"
          :data="pagedData"
          :sort-state="sortState"
          bordered
          striped
          @sort-change="handleSortChange"
          @row-click="handleRowClick"
        />
        <div class="demo-pagination">
          <VPagination
            v-model="currentPage"
            :total="tableData.length"
            :page-size="pageSize"
            :page-sizes="[5, 10, 20]"
            :layout="['total', 'sizes', 'prev', 'pager', 'next', 'jumper']"
            @change="handlePageChange"
          />
        </div>
      </section>

      <!-- Upload -->
      <section class="demo-section">
        <h2>Upload 上传</h2>
        <VUpload
          :file-list="uploadFiles"
          :multiple="true"
          :max-size="10240"
          drag
          @update:file-list="uploadFiles = $event"
          @exceed="handleExceed"
          @remove="handleRemove"
        />
      </section>

      <!-- Tree -->
      <section class="demo-section">
        <h2>Tree 树形控件</h2>
        <VTree
          :data="treeData"
          v-model:expanded-keys="treeExpandedKeys"
          v-model:selected-keys="treeSelectedKeys"
          checkable
          v-model:checked-keys="treeCheckedKeys"
          block-node
          @select="handleTreeSelect"
        />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  VButton, VInput, VModal, VDrawer,
  VTable, VPagination, VUpload, VTree,
  type TableColumn, type SortState,
  type UploadFile, type TreeNode,
} from './components';

// ---- Button ----
function log(type: string): void {
  console.log(`Button clicked: ${type}`);
}

// ---- Input ----
const inputVal = ref('');
const inputVal2 = ref('');
const inputVal3 = ref('');
const inputVal4 = ref('禁用');

// ---- Modal ----
const showModal = ref(false);
const showModalSmall = ref(false);
function handleConfirm(): void { console.log('confirmed'); showModal.value = false; }
function handleCancel(): void { console.log('cancelled'); }

// ---- Drawer ----
const drawerRight = ref(false);
const drawerLeft = ref(false);
const drawerTop = ref(false);
const drawerBottom = ref(false);

// ---- Table ----
interface UserRow {
  id: number;
  name: string;
  age: number;
  email: string;
  role: string;
}

const tableColumns: TableColumn<UserRow>[] = [
  { key: 'id', title: 'ID', dataIndex: 'id', width: 80, sortable: true, align: 'center' },
  { key: 'name', title: '姓名', dataIndex: 'name', sortable: true },
  { key: 'age', title: '年龄', dataIndex: 'age', width: 100, sortable: true, align: 'right' },
  { key: 'email', title: '邮箱', dataIndex: 'email' },
  { key: 'role', title: '角色', dataIndex: 'role', align: 'center' },
];

const tableData: UserRow[] = Array.from({ length: 46 }, (_, i) => ({
  id: i + 1,
  name: `用户${i + 1}`,
  age: 20 + (i % 40),
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? '管理员' : i % 3 === 1 ? '编辑' : '访客',
}));

const currentPage = ref(1);
const pageSize = ref(10);
const sortState = ref<SortState | null>(null);

const sortedData = computed(() => {
  const data = [...tableData];
  if (sortState.value?.order && sortState.value.key) {
    const key = sortState.value.key as keyof UserRow;
    const order = sortState.value.order;
    data.sort((a, b) => {
      const va = a[key];
      const vb = b[key];
      if (va < vb) return order === 'asc' ? -1 : 1;
      if (va > vb) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }
  return data;
});

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return sortedData.value.slice(start, start + pageSize.value);
});

function handleSortChange(state: SortState): void { sortState.value = state; }
function handleRowClick(row: Record<string, unknown>, index: number): void { console.log('Row clicked:', row, index); }
function handlePageChange(page: number, size: number): void { currentPage.value = page; pageSize.value = size; }

// ---- Upload ----
const uploadFiles = ref<UploadFile[]>([]);
function handleExceed(files: File[], list: UploadFile[]): void { console.log('exceed', files.length, list.length); }
function handleRemove(file: UploadFile): void { console.log('removed', file.name); }

// ---- Tree ----
const treeData: TreeNode[] = [
  {
    key: '1', label: '研发部', children: [
      { key: '1-1', label: '前端组', children: [
        { key: '1-1-1', label: '张三' },
        { key: '1-1-2', label: '李四' },
      ]},
      { key: '1-2', label: '后端组', children: [
        { key: '1-2-1', label: '王五' },
        { key: '1-2-2', label: '赵六' },
      ]},
    ],
  },
  {
    key: '2', label: '产品部', children: [
      { key: '2-1', label: '设计组' },
      { key: '2-2', label: '运营组' },
    ],
  },
  { key: '3', label: '行政部' },
];

const treeExpandedKeys = ref<(string | number)[]>(['1']);
const treeSelectedKeys = ref<(string | number)[]>([]);
const treeCheckedKeys = ref<(string | number)[]>([]);

function handleTreeSelect(keys: (string | number)[], node: TreeNode): void {
  console.log('Tree selected:', keys, node.label);
}
</script>

<style lang="scss">
.demo-app {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px;
}

.demo-header {
  text-align: center;
  margin-bottom: 40px;

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    color: #6b7280;
  }
}

.demo-main {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.demo-section {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);

  h2 {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e5e7eb;
  }
}

.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.demo-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.demo-info {
  margin-top: 8px;
  font-size: 13px;
  color: #6b7280;
}

.demo-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}
</style>
