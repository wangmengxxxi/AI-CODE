# AI Code 前端设计规范与风格指南

> 本文档用于指导后续功能开发，确保新功能与现有页面保持一致的设计风格和交互体验。

## 技术栈

### 核心框架
- **Vue 3** - 使用 Composition API（`<script setup>`）
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Vue Router** - 路由管理
- **Pinia** - 状态管理

### UI 组件库
- **Ant Design Vue** - 主要 UI 组件库
- 组件按需引入，使用 `a-` 前缀

### 样式方案
- **Less** - CSS 预处理器
- **Scoped Styles** - 组件级样式隔离

### 工具库
- **Axios** - HTTP 请求（带认证拦截器）
- **markdown-it** - Markdown 渲染
- **highlight.js** - 代码高亮（atom-one-dark 主题）

---

## 设计风格

### 主题色
```less
// 主色调 - 紫色
@primary-color: #722ED1;

// 渐变色（用于标题等）
@gradient-colors: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);

// 文字颜色
@text-primary: #333;
@text-secondary: #666;
@text-disabled: #999;

// 背景色
@bg-white: #fff;
@bg-gray: #f5f5f5;
@bg-light: #fafafa;

// 边框颜色
@border-color: #e8e8e8;
```

### 设计原则
1. **简洁清爽** - 白色背景为主，避免花哨的视觉效果
2. **现代感** - 使用渐变色标题、圆角卡片、柔和阴影
3. **响应式** - 适配桌面和移动端
4. **一致性** - 统一的间距、字号、颜色

### 视觉元素
- **圆角**: 卡片 12px，按钮 4-8px，输入框 16px
- **阴影**: `0 2px 8px rgba(0,0,0,0.06)` (卡片)
- **间距**: 基础单位 8px，常用 12px, 16px, 24px
- **字号**: 标题 56px/24px，正文 14-16px，辅助文字 12px

---

## 页面布局规范

### 主页 (HomeView.vue)

**布局结构**:
```
┌─────────────────────────────────┐
│   Hero Section (白色背景)        │
│   - 渐变色标题                    │
│   - 副标题                        │
│   - 输入框 + 快捷标签             │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│   我的作品 (白色背景)             │
│   - 应用卡片网格                  │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│   精选案例 (浅灰背景)             │
│   - 应用卡片网格                  │
└─────────────────────────────────┘
```

**关键样式**:
- Hero 区域：`padding: 100px 24px 80px`
- 标题渐变：`background: linear-gradient(...); -webkit-background-clip: text`
- 卡片网格：`grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`

### 编辑器页面 (Editor.vue)

**布局结构**:
```
┌─────────────────────────────────┐
│   Header (应用名称 + 操作按钮)    │
└─────────────────────────────────┘
┌──────────────┬──────────────────┐
│  对话区 40%  │  预览区 60%      │
│              │                  │
│  [消息列表]  │  [iframe 预览]   │
│              │                  │
│  [输入框]    │                  │
└──────────────┴──────────────────┘
```

**布局比例**:
- 左侧对话区：`width: 40%`
- 右侧预览区：`flex: 1` (占剩余空间)
- 无间距：`gap: 0`

---

## 组件规范

### AppCard (应用卡片)

**结构**:
```
┌─────────────────────┐
│   封面图 (160px)    │
│   [操作按钮浮层]    │
├─────────────────────┤
│ [头像] 应用标题     │
│        @用户昵称    │
└─────────────────────┘
```

**关键特性**:
- 默认封面：紫蓝渐变 + 火箭 emoji
- 默认头像：灰色人物图标 SVG
- 悬停效果：上浮 4px + 阴影加深
- 操作按钮：预览（眼睛）、编辑（笔）、删除（垃圾桶）

**交互行为**:
- **预览按钮**: 
  - 已部署 → 新窗口打开 `http://localhost/{deployKey}/`
  - 未部署 → 跳转编辑器
- **编辑按钮**: 打开编辑对话框（修改应用名称）
- **删除按钮**: 确认对话框 → 删除

### PromptInput (提示词输入框)

**结构**:
- 白色卡片背景，圆角 16px
- 柔和阴影：`0 4px 24px rgba(0,0,0,0.08)`
- Textarea：无边框，`minRows: 1`
- 发送按钮：紫色圆形按钮（右下角）
- 快捷标签：4 个灰色标签，悬停紫色

**快捷标签内容**:
```typescript
['个人博客网站', '企业官网', '在线商城', '产品展示网站']
```

### MarkdownRenderer (Markdown 渲染)

**样式特点**:
- 标题：渐进字号，底部边框
- 代码块：深色背景 `#2d2d2d`，atom-one-dark 高亮
- 行内代码：粉色 `#d63384`，浅灰背景
- 引用块：左侧紫色边框 `4px solid #722ED1`
- 链接：紫色 `#722ED1`

---

## 交互规范

### 消息提示
```typescript
// 成功
message.success('操作成功')

// 警告
message.warning('请输入内容')

// 错误
message.error('操作失败，请重试')

// 提示
message.info('请先登录')
```

### 确认对话框
```typescript
Modal.confirm({
  title: '确认删除',
  content: '确定要删除应用「XXX」吗？此操作不可恢复。',
  okText: '删除',
  okType: 'danger',
  cancelText: '取消',
  async onOk() {
    // 执行删除
  }
})
```

### 加载状态
- 小型按钮：`size="small"`
- 加载中：`:loading="loading"`
- 禁用状态：`:disabled="!condition"`

### 表单验证
- 必填项：红色星号 `required`
- 字数限制：`show-count` + `:maxlength`
- 输入提示：清晰的 `placeholder`

---

## 路由配置

### 主要路由
```typescript
{
  path: '/',
  name: 'home',
  component: HomeView
},
{
  path: '/editor/:id',
  name: 'editor',
  component: Editor,
  meta: { requiresAuth: true }
},
{
  path: '/login',
  name: 'login',
  component: Login
}
```

### 路由守卫
- 需要登录的页面：`meta: { requiresAuth: true }`
- 未登录重定向：携带 `redirect` 参数

---

## API 调用规范

### 请求配置
- Base URL: `http://localhost:8080`
- 超时时间: `60000ms`
- 携带凭证: `withCredentials: true`

### 响应格式
```typescript
{
  code: 0,           // 0 表示成功
  data: any,         // 返回数据
  message: string    // 错误消息
}
```

### 错误处理
```typescript
try {
  const res = await apiCall()
  if (res.data.code === 0) {
    // 成功处理
  } else {
    message.error(res.data.message || '操作失败')
  }
} catch (error) {
  message.error('操作失败，请重试')
}
```

---

## 代码风格规范

### 命名规范
- **组件**: PascalCase - `AppCard.vue`
- **变量/函数**: camelCase - `handleSend`, `myApps`
- **常量**: UPPER_SNAKE_CASE - `DEFAULT_AVATAR`
- **类型**: PascalCase - `AppVO`, `PageResponse`

### 组件结构顺序
```vue
<script setup lang="ts">
// 1. 导入
import { ref } from 'vue'

// 2. Props & Emits
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 3. 响应式数据
const loading = ref(false)

// 4. 计算属性
const computed = computed(() => ...)

// 5. 函数
function handleClick() { ... }

// 6. 生命周期
onMounted(() => { ... })
</script>

<template>
  <!-- 模板 -->
</template>

<style scoped lang="less">
/* 样式 */
</style>
```

### 注释规范
- 复杂逻辑：添加单行注释
- 函数说明：描述功能和参数
- 区块划分：使用注释分隔（如 `<!-- Hero 区域 -->`）

---

## 现有功能模块总结

### 1. 主页功能
- ✅ Hero 标语区域
- ✅ 提示词输入框
- ✅ 快捷标签
- ✅ 我的作品列表（需登录）
- ✅ 精选案例列表
- ✅ 分页功能

### 2. 应用卡片功能
- ✅ 封面展示（默认渐变 SVG）
- ✅ 用户头像 + 昵称
- ✅ 预览已部署应用
- ✅ 编辑应用名称（对话框）
- ✅ 删除应用（确认对话框）

### 3. 编辑器功能
- ✅ AI 对话生成代码
- ✅ SSE 流式响应
- ✅ Markdown 渲染 + 代码高亮
- ✅ 实时预览（iframe）
- ✅ 代码提取与合并（支持分离的 html/css/js）
- ✅ 部署功能
- ✅ 修改应用名称

### 4. 用户认证
- ✅ 登录/注册
- ✅ 用户信息管理
- ✅ 退出登录
- ✅ 路由守卫

---

## 扩展开发建议

### 添加新页面时
1. 参考现有页面的布局结构
2. 使用统一的主题色和间距
3. 保持组件命名和文件结构一致
4. 添加路由和导航链接

### 添加新组件时
1. 使用 `<script setup>` + TypeScript
2. 定义清晰的 Props 和 Emits 接口
3. 使用 Ant Design Vue 组件
4. 保持样式的 scoped + less 组合
5. 添加必要的类型定义到 `types/index.ts`

### 添加新 API 时
1. 在 `api/` 目录下按模块分类
2. 定义请求和响应的 TypeScript 类型
3. 统一错误处理
4. 添加 loading 状态

---

## 常见问题

**Q: 如何保持设计一致性？**  
A: 参考本文档的主题色、间距、字号等规范，复用现有组件。

**Q: 如何处理 AI 生成的代码？**  
A: 使用 `extractHtmlCode` 工具函数提取和合并代码块。

**Q: 如何添加代码高亮？**  
A: 使用 `MarkdownRenderer` 组件渲染 Markdown 内容。

**Q: 如何实现响应式布局？**  
A: 使用 `grid` 或 `flex` 布局，添加媒体查询适配移动端。

---

## 更新日志

- **2026-01-27**: 初始版本，记录当前设计规范和功能模块
