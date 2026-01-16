# AI Code Platform 前端开发规范

> 本文档定义了 AI Code Platform 前端项目的技术栈、设计规范和编码标准。所有后续前端开发必须遵循此文档。

---

## 📦 技术栈

| 类别         | 技术                  | 版本                   |
| ------------ | --------------------- | ---------------------- |
| 核心框架     | Vue 3                 | 3.5.x                  |
| 开发语言     | TypeScript            | 5.x (Strict Mode)      |
| 状态管理     | Pinia                 | 3.x (Setup Store 模式) |
| 路由         | Vue Router            | 4.x                    |
| UI 组件库    | Ant Design Vue        | 4.x                    |
| HTTP 客户端  | Axios                 | 1.x                    |
| 图标库       | @ant-design/icons-vue | -                      |
| CSS 预处理器 | SCSS (sass-embedded)  | -                      |
| 构建工具     | Vite                  | 7.x                    |

---

## 🎨 设计规范

### 颜色系统

```scss
// 主色调 - 深色主题
$bg-primary: #0f172a; // Slate 900 - 主背景
$bg-secondary: #1e293b; // Slate 800 - 次级背景
$bg-card: rgba(30, 41, 59, 0.9); // 卡片背景

// 品牌色
$brand-blue: #1677ff; // Ant Design Blue - 主操作色
$brand-purple: #a78bfa; // 紫色 - 次要强调
$brand-pink: #ec4899; // 粉色 - 注册页强调
$brand-green: #22c55e; // 绿色 - 成功状态

// 文字颜色
$text-primary: #ffffff;
$text-secondary: rgba(255, 255, 255, 0.85);
$text-tertiary: rgba(255, 255, 255, 0.7);
$text-disabled: rgba(255, 255, 255, 0.4);

// 边框颜色
$border-default: rgba(255, 255, 255, 0.1);
$border-secondary: rgba(255, 255, 255, 0.2);
$border-hover: rgba(255, 255, 255, 0.3);

// 渐变
$gradient-title: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
$gradient-button: linear-gradient(135deg, #1677ff 0%, #5b8def 100%);
$gradient-register: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
$gradient-bg: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
```

### 字体

```scss
// 主字体
$font-family:
  -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

// 代码字体
$font-mono: 'Roboto Mono', 'Consolas', 'Monaco', monospace;

// 字号
$font-size-xs: 12px;
$font-size-sm: 14px;
$font-size-base: 16px;
$font-size-lg: 18px;
$font-size-xl: 20px;
$font-size-2xl: 24px;
$font-size-3xl: 28px;
$font-size-4xl: 32px;
$font-size-hero: 56px;
```

### 间距

```scss
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
$spacing-2xl: 48px;
```

### 圆角

```scss
$radius-sm: 8px;
$radius-md: 12px;
$radius-lg: 16px;
$radius-xl: 24px;
```

### 阴影

```scss
$shadow-card: 0 20px 60px rgba(0, 0, 0, 0.4);
$shadow-hover: 0 8px 24px rgba(22, 119, 255, 0.4);
$shadow-button: 0 8px 24px rgba(22, 119, 255, 0.4);
```

---

## 📁 目录结构

```
src/main/resources/fronted/ai-code-front/src/
├── api/                    # API 接口封装
│   ├── request.ts          # Axios 实例 + 拦截器
│   └── user.ts             # 用户相关 API
├── assets/                 # 静态资源
│   └── main.css            # 全局样式
├── components/             # 公共组件
├── composables/            # Composable Hooks
│   └── useAuth.ts          # 认证逻辑
├── layouts/                # 布局组件
│   └── BasicLayout.vue     # 通用布局 (Header + Content + Footer)
├── router/                 # 路由配置
│   └── index.ts
├── stores/                 # Pinia Store
│   └── userStore.ts
├── types/                  # TypeScript 类型定义
│   └── user.ts
├── views/                  # 页面组件
│   ├── admin/              # 管理员页面
│   │   └── UserManage.vue
│   ├── LoginPage.vue
│   ├── RegisterPage.vue
│   ├── UserProfile.vue
│   └── HomeView.vue
├── App.vue
└── main.ts
```

---

## 💻 编码规范

### Vue 组件规范

```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup lang="ts">
// 1. 导入
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { SomeIcon } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/userStore'
import { someAPI } from '@/api/someApi'
import type { SomeType } from '@/types/someType'

// 2. Props 和 Emits (如需要)
interface Props {
  title: string
  count?: number
}
const props = withDefaults(defineProps<Props>(), {
  count: 0,
})

const emit = defineEmits<{
  (e: 'update', value: string): void
}>()

// 3. 响应式状态
const loading = ref(false)
const formData = reactive({
  name: '',
  email: '',
})

// 4. 计算属性
const isValid = computed(() => formData.name.length > 0)

// 5. 方法
const handleSubmit = async () => {
  try {
    loading.value = true
    await someAPI(formData)
    message.success('操作成功')
  } catch (error) {
    console.error('操作失败:', error)
  } finally {
    loading.value = false
  }
}

// 6. 生命周期
onMounted(() => {
  // 初始化逻辑
})
</script>

<style scoped lang="scss">
// 样式
</style>
```

### TypeScript 规范

```typescript
// ✅ 正确: 使用 interface 定义类型
export interface UserVO {
  id: number
  userAccount: string
  userName: string | null
}

// ✅ 正确: API 响应必须有类型
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

// ❌ 禁止: 使用 any
const data: any = {}

// ✅ 正确: 使用 unknown + 类型收窄
const data: unknown = {}
if (typeof data === 'object' && data !== null) {
  // 使用 data
}
```

### Pinia Store 规范 (Setup Store)

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useExampleStore = defineStore('example', () => {
  // State
  const items = ref<Item[]>([])
  const loading = ref(false)

  // Getters
  const itemCount = computed(() => items.value.length)

  // Actions
  const fetchItems = async () => {
    try {
      loading.value = true
      const res = await getItemsAPI()
      if (res.code === 0) {
        items.value = res.data
      }
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    loading,
    itemCount,
    fetchItems,
  }
})
```

### API 封装规范

```typescript
// api/example.ts
import request from './request'
import type { ApiResponse, ExampleVO } from '@/types/example'

export const getExampleAPI = (id: number): Promise<ApiResponse<ExampleVO>> => {
  return request.get('/example/get', { params: { id } })
}

export const createExampleAPI = (data: CreateRequest): Promise<ApiResponse<number>> => {
  return request.post('/example/create', data)
}
```

---

## 🎨 组件样式规范

### 深色主题表单输入框

```scss
:deep(.ant-input) {
  background: transparent !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
  color: #fff !important;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:hover,
  &:focus {
    border-color: #1677ff !important;
  }
}

:deep(.ant-select-selector) {
  background: transparent !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
  color: #fff !important;
}
```

### 深色主题表格

```scss
:deep(.ant-table) {
  background: transparent;

  .ant-table-thead > tr > th {
    background: rgba(15, 23, 42, 0.8);
    color: rgba(255, 255, 255, 0.85);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .ant-table-tbody > tr > td {
    background: rgba(15, 23, 42, 0.4);
    color: #fff;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .ant-table-tbody > tr:hover > td {
    background: rgba(22, 119, 255, 0.1);
  }
}
```

### 深色主题分页

```scss
:deep(.ant-pagination) {
  color: #fff !important;

  .ant-pagination-total-text {
    color: rgba(255, 255, 255, 0.85) !important;
  }

  .ant-pagination-item {
    background: rgba(15, 23, 42, 0.6) !important;
    border-color: rgba(255, 255, 255, 0.3) !important;

    a {
      color: #fff !important;
    }
  }

  .ant-pagination-prev,
  .ant-pagination-next {
    button {
      background: rgba(15, 23, 42, 0.6) !important;
      border-color: rgba(255, 255, 255, 0.3) !important;
      color: #fff !important;
    }
  }
}
```

### 深色主题 Modal

```scss
:deep(.ant-modal) {
  .ant-modal-content {
    background: #1e293b;
  }

  .ant-modal-header {
    background: transparent;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .ant-modal-title {
      color: #fff;
    }
  }

  .ant-form-item-label > label {
    color: rgba(255, 255, 255, 0.85);
  }
}
```

### 卡片组件

```scss
.card {
  background: rgba(30, 41, 59, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}
```

### 渐变标题

```scss
.gradient-title {
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### 悬浮动画

```scss
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.floating {
  animation: float 3s ease-in-out infinite;
}
```

---

## 🔒 路由与权限

### 路由 Meta 定义

```typescript
{
  path: '/admin/users',
  name: 'AdminUsers',
  component: () => import('@/views/admin/UserManage.vue'),
  meta: {
    requiresAuth: true,      // 需要登录
    requiresAdmin: true,     // 需要管理员权限
    title: '用户管理'         // 页面标题
  }
}
```

### 权限控制

- **普通页面**: `meta: { requiresAuth: true }`
- **管理员页面**: `meta: { requiresAuth: true, requiresAdmin: true }`
- **公开页面**: `meta: { requiresAuth: false }`

---

## 📋 命名规范

| 类型       | 规范                   | 示例                    |
| ---------- | ---------------------- | ----------------------- |
| 组件文件   | PascalCase             | `UserProfile.vue`       |
| Composable | camelCase + use 前缀   | `useAuth.ts`            |
| Store      | camelCase + Store 后缀 | `userStore.ts`          |
| API 文件   | camelCase              | `user.ts`               |
| API 函数   | camelCase + API 后缀   | `getUserAPI()`          |
| 类型       | PascalCase             | `UserVO`, `LoginUserVO` |
| CSS 类名   | kebab-case             | `.user-profile`         |

---

## ⚠️ 注意事项

1. **禁止使用 Options API** - 只使用 Composition API + `<script setup>`
2. **禁止使用 `any`** - 使用 `unknown` 并进行类型收窄
3. **所有 API 响应必须定义类型** - 使用 `ApiResponse<T>` 泛型
4. **深色主题 Ant Design 组件** - 必须使用 `:deep()` 穿透 scoped 样式
5. **表单组件** - 背景使用 `transparent`,边框使用 `rgba(255,255,255,0.2)`
6. **使用 BasicLayout** - 需要导航栏的页面必须包裹 `<BasicLayout>`

---

## 🚀 开发命令

```bash
# 进入前端目录
cd src/main/resources/fronted/ai-code-front

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 构建生产版本
npm run build
```

---

**文档版本**: 1.0  
**最后更新**: 2026-01-16  
**维护者**: AI Code Platform Team
