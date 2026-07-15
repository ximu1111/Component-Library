# AGENTS.md

## 项目概览

Vue3 通用组件库项目，包含 8 个高质量通用组件，采用 TypeScript 严格类型系统。

## 技术栈

- **框架**: Vue 3.5 + TypeScript 5
- **构建工具**: Vite 7
- **样式**: SCSS (BEM 命名规范)
- **测试**: Vitest + @vue/test-utils
- **代码规范**: ESLint 9 + typescript-eslint + eslint-plugin-vue

## 目录结构

```
├── src/
│   ├── components/           # 组件库
│   │   ├── Button/           # 按钮组件
│   │   ├── Input/            # 输入框组件
│   │   ├── Modal/            # 弹窗组件
│   │   ├── Drawer/           # 抽屉组件
│   │   ├── Table/            # 表格组件
│   │   ├── Pagination/       # 分页组件
│   │   ├── Upload/           # 上传组件
│   │   ├── Tree/             # 树形控件组件
│   │   └── index.ts          # 统一导出
│   ├── styles/               # 全局样式
│   │   ├── _variables.scss   # SCSS 变量
│   │   └── index.scss        # 全局样式入口
│   ├── __tests__/            # 单元测试
│   ├── App.vue               # 演示页面
│   └── main.ts               # 入口文件
├── vite.config.ts            # Vite 配置
├── vitest.config.ts          # Vitest 配置
├── tsconfig.json             # TypeScript 配置
└── eslint.config.mjs         # ESLint 配置
```

## 构建与运行命令

```bash
# 安装依赖
pnpm install

# 开发环境
pnpm dev

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview

# 运行单元测试
pnpm vitest run

# 类型检查
pnpm vue-tsc --noEmit -p tsconfig.json

# 代码检查
pnpm lint --quiet
```

## 组件开发规范

### 组件结构

每个组件目录包含：
- `types.ts` - TypeScript 类型定义（interface、泛型）
- `VXxx.vue` - 组件实现（SFC）
- `index.ts` - 导出入口

### 类型系统

- 使用 TS 泛型定义组件入参类型（如 `TableColumn<T>`、`TreeNode<T>`）
- 使用 `interface` 定义 Props 和 Emits 类型
- 使用 `defineProps<T>()` 和 `defineEmits<T>()` 进行类型推导

### v-model 双向绑定

- 使用 `modelValue` prop + `update:modelValue` emit
- 支持 `v-model` 语法糖

### attrs 透传

- 使用 `v-bind="$attrs"` 透传未声明属性
- 设置 `inheritAttrs: false` 避免重复绑定

### 样式隔离

- 使用 `<style scoped lang="scss">`
- 遵循 BEM 命名规范：`.v-{component}__{element}--{modifier}`

## 代码风格

- 使用 TypeScript `strict` 模式
- 禁止隐式 `any`（组件内部除外）
- 函数参数必须标注类型
- 优先复用已声明的变量和类型
