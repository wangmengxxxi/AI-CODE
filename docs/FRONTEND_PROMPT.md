C:\Users\DDD\.gemini\antigravity\brain\dcae804c-eb4e-4082-83e0-009e9982de01\implementation_plan.md.resolved
C:\Users\DDD\.gemini\antigravity\brain\dcae804c-eb4e-4082-83e0-009e9982de01\task.md.resolved
# AI Code  前端开发需求文档

> 版本：v1.0
> 最后更新：2026-01-26
> 状态：待开发

---

## 一、项目概述

**AI Code** 是一个零代码 AI 编程平台，用户通过自然语言描述需求，AI 自动生成并部署 Web 应用。

### 项目地址

前端路径在src\main\resources\fronted中
api接口文档在'docs\API.md'当中


### 技术栈（严格遵守）

| 类别 | 技术 | 版本要求 | 说明 |
|------|------|---------|------|
| 前端框架 | Vue 3 | 3.x | 必须使用 `<script setup lang="ts">`，仅限 Composition API |
| UI 组件库 | Ant Design Vue | 4.x | 使用 `<a-config-provider>` 配置全局主题 |
| 状态管理 | Pinia | 2.x | Store 必须使用 Setup Syntax |
| 路由 | Vue Router | 4.x | - |
| 样式方案 | Less / Tailwind CSS | - | 可与 Ant Design 共存 |
| 构建工具 | Vite | 5.x | - |
| 网络请求 | Axios | 1.x | REST API 请求 |
| SSE | 原生 fetch | - | 仅用于流式请求 |

### 禁止项

- 使用 Options API
- 使用 Element Plus
- 使用 `any` 类型
- 引入未声明的第三方库
- 生成后端代码

---

## 二、后端接口规范

### 2.1 基础配置

**重要**：后端接口路径**没有** `/api` 前缀！

```typescript
// src/api/index.ts
const instance = axios.create({
  baseURL: '/',  // 注意：是根路径，不是 /api
  timeout: 60000,
  withCredentials: true,  // 必须携带 Cookie
  headers: {
    'Content-Type': 'application/json'
  }
})
```

| 配置项 | 值 | 说明 |
|--------|-----|------|
| Base URL | `http://localhost:8080` | 开发环境 |
| 超时时间 | 60000ms | 60秒 |
| 认证方式 | Cookie/Session | **不是 JWT** |
| withCredentials | `true` | 必须携带 Cookie |

### 2.2 接口路径对照表

| 模块 | 接口路径 | 说明 |
|------|---------|------|
| 用户 | `/user/register` | 注册 |
| 用户 | `/user/login` | 登录 |
| 用户 | `/user/get/login` | 获取当前登录用户 |
| 用户 | `/user/logout` | 登出 |
| 应用 | `/app/add` | 创建应用 |
| 应用 | `/app/delete` | 删除应用 |
| 应用 | `/app/update` | 更新应用 |
| 应用 | `/app/get/vo` | 获取应用详情 |
| 应用 | `/app/my/list/page/vo` | 我的应用列表 |
| 应用 | `/app/good/list/page/vo` | 精选应用列表 |
| 应用 | `/app/chat/gen/code` | **SSE 流式生成代码** |
| 应用 | `/app/deploy` | 部署应用 |
| 管理员 | `/app/admin/delete` | 管理员删除应用 |
| 管理员 | `/app/admin/update` | 管理员更新应用 |
| 管理员 | `/app/admin/get/vo` | 管理员获取应用 |
| 管理员 | `/app/admin/list/page/vo` | 管理员应用列表 |
| 静态资源 | `/static/{deployKey}/**` | 访问部署的应用 |

### 2.3 统一响应结构

```typescript
interface BaseResponse<T> {
  code: number        // 0 表示成功
  data: T             // 返回数据
  message: string     // 提示信息
}

interface PageResponse<T> {
  records: T[]
  pageNumber: number
  pageSize: number
  totalRow: number
}
```

### 2.4 SSE 流式接口规范

**接口**：`GET /app/chat/gen/code`

**请求参数**（Query String）：

```typescript
// 使用原生 fetch，GET 请求
fetch(`http://localhost:8080/app/chat/gen/code?appId=${appId}&message=${message}`, {
  method: 'GET',
  credentials: 'include',  // 必须携带 Cookie
  headers: {
    'Accept': 'text/event-stream'
  }
})
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| appId | number | 是 | 应用 ID |
| message | string | 是 | 用户需求描述 |

**响应格式**（SSE）：

```
data:{"d":"<"}
data:{"d":"!DOCTYPE html>"}
data:{"d":"<html>"}
event: done
data:
```

**解析逻辑**：

```typescript
// 每行数据格式：data:{"d":"内容"}
// 解析步骤：
// 1. 去掉 "data:" 前缀
// 2. JSON.parse() 解析得到 {d: "内容"}
// 3. 取 d 字段的内容进行拼接
```

**结束标识**：收到 `event: done` 时表示传输结束。

---

## 三、用户角色与权限

### 3.1 角色定义

| 角色 | userRole 值 | 说明 |
|------|-------------|------|
| 游客 | - | 未登录用户 |
| 普通用户 | `user` | 已登录用户 |
| 管理员 | `admin` | 系统管理员 |

### 3.2 权限矩阵

| 页面/功能 | 游客 | 普通用户 | 管理员 |
|-----------|------|----------|--------|
| 首页 `/` | ✅ | ✅ | ✅ |
| 作品集 `/portfolio` | ✅（仅精选） | ✅ | ✅ |
| 应用预览 | ✅ | ✅ | ✅ |
| 编辑器 `/editor` | ❌ | ✅ | ✅ |
| 我的作品 | ❌ | ✅ | ✅ |
| 个人中心 `/profile` | ❌ | ✅ | ✅ |
| 管理后台 `/admin/**` | ❌ | ❌ | ✅ |

### 3.3 路由权限守卫规则

```typescript
// 路由守卫伪代码
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const userRole = authStore.user?.userRole

  // 未登录访问需要登录的页面 → 跳转登录
  if (!isAuthenticated && needAuth.includes(to.path)) {
    return next('/login')
  }

  // 已登录访问登录页 → 跳转首页
  if (isAuthenticated && to.path === '/login') {
    return next('/')
  }

  // 管理员页面权限检查
  if (to.path.startsWith('/admin') && userRole !== 'admin') {
    return next('/')
  }

  next()
})
```

---

## 四、全局视觉规范

### 4.1 主题配置

```typescript
// 主题色：紫罗兰色
const theme = {
  token: {
    colorPrimary: '#722ED1',      // 主色
    colorSuccess: '#52C41A',
    colorWarning: '#FAAD14',
    colorError: '#F5222D',
    borderRadius: 8,
  }
}
```

### 4.2 布局结构

使用 Ant Design Vue `<a-layout>` 组件：

```
┌─────────────────────────────────────┐
│           Header (固定)               │
├─────────────────────────────────────┤
│                                     │
│           Content (自适应)            │
│                                     │
├─────────────────────────────────────┤
│           Footer (固定)               │
└─────────────────────────────────────┘
```

### 4.3 深色模式支持

```typescript
// 在 App.vue 中配置
<a-config-provider :theme="theme">
  <a-layout class="layout">
    <!-- ... -->
  </a-layout>
</a-config-provider>
```

---

## 五、核心模块详细需求

### 5.1 用户认证模块（Auth）

#### 页面列表

| 页面 | 路径 | 说明 |
|------|------|------|
| 登录页 | `/login` | 账号密码登录 |
| 注册页 | `/register` | 新用户注册 |

#### 登录页（Login.vue）

**功能要求**：

1. 表单字段：
   - `userAccount`：账号（必填）
   - `userPassword`：密码（必填）

2. 表单校验：
   - 账号长度：4-20 位
   - 密码长度：6-20 位

3. 行为逻辑：
   - 登录成功 → 保存用户信息到 Pinia Store → 跳转首页
   - 登录失败 → 显示错误提示

**API 调用**：

```typescript
// POST /user/login
{
  "userAccount": "string",
  "userPassword": "string"
}
```

#### 注册页（Register.vue）

**功能要求**：

1. 表单字段：
   - `userAccount`：账号（必填）
   - `userPassword`：密码（必填）
   - `checkPassword`：确认密码（必填）

2. 表单校验：
   - 账号长度：4-20 位
   - 密码长度：6-20 位
   - 两次密码必须一致

3. 行为逻辑：
   - 注册成功 → 自动登录 → 跳转首页

**API 调用**：

```typescript
// POST /user/register
{
  "userAccount": "string",
  "userPassword": "string",
  "checkPassword": "string"
}
```

#### Auth Store（stores/auth.ts）

```typescript
interface User {
  id: number
  userAccount: string
  userName: string
  userAvatar: string
  userProfile: string
  userRole: 'user' | 'admin'
  createTime: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Actions
login(account: string, password: string): Promise<void>
register(account: string, password: string, checkPassword: string): Promise<void>
logout(): Promise<void>
fetchLoginUser(): Promise<void>
}
```

---

### 5.2 首页（Home.vue）

#### 功能要求

1. **沉浸式 Hero 区域**：
   - 大标题 + 副标题
   - 渐变背景动画

2. **核心组件：PromptInput.vue**

   **UI 结构**：
   ```
   ┌─────────────────────────────────────┐
   │  [   大尺寸输入框（支持多行）       ]  │
   │  [上传图标]           [发送按钮 →]    │
   └─────────────────────────────────────┘
   ```

   **行为逻辑**：
   - 用户点击"发送"时：
     - 若未登录 → 跳转 `/login` → 登录成功后重定向回 `/editor?prompt=xxx`
     - 若已登录 → 直接跳转 `/editor?prompt=xxx`

---

### 5.3 作品集页（Portfolio.vue）

#### 功能要求

**两个 Tab**：

1. **精选案例**（所有用户可见）
2. **我的作品**（仅登录用户可见）

#### AppCard.vue 卡片组件

**UI 结构**：
```
┌─────────────────────────┐
│     [应用封面图]          │
│                         │
│  应用名称                │
│  创建时间                │
│                         │
│  [预览] [编辑] [删除]    │  ← 悬停时显示
└─────────────────────────┘
```

**权限逻辑**：

| 操作 | 游客 | 普通用户（本人） | 普通用户（他人） | 管理员 |
|------|------|-----------------|-----------------|--------|
| 预览 | ✅ | ✅ | ✅ | ✅ |
| 编辑 | ❌ | ✅ | ❌ | ✅ |
| 删除 | ❌ | ✅ | ❌ | ✅ |
| 设为精选 | ❌ | ❌ | ❌ | ✅ |

**API 调用**：

```typescript
// 精选案例
POST /app/good/list/page/vo
{
  "pageNum": 1,
  "pageSize": 20
}

// 我的作品
POST /app/my/list/page/vo
{
  "pageNum": 1,
  "pageSize": 20
}
```

---

### 5.4 生成编辑器（Editor.vue）⭐ 核心模块

#### 布局结构

```
┌─────────────────────────────────────────────────────────┐
│  顶部操作栏：[保存] [部署] [返回]                        │
├────────────────────┬────────────────────────────────────┤
│                    │                                    │
│   对话区域         │       实时预览区域                  │
│   (固定 400px)     │       (自适应宽度)                  │
│                    │                                    │
│  ┌──────────────┐ │  ┌──────────────────────────────┐  │
│  │ 消息列表     │ │  │                              │  │
│  │              │ │  │      iframe 预览沙箱          │  │
│  │  用户: xxx   │ │  │                              │  │
│  │  AI: xxx     │ │  │                              │  │
│  │              │ │  │                              │  │
│  └──────────────┘ │  └──────────────────────────────┘  │
│                    │                                    │
│  [输入框 + 发送]    │                                    │
└────────────────────┴────────────────────────────────────┘
```

#### 功能要求

**1. SSE 流式通信**

创建 `composables/useSSE.ts`：

```typescript
interface UseSSEOptions {
  appId: number
  message: string
  onChunk: (chunk: string) => void
  onComplete: () => void
  onError: (error: Error) => void
}

function useSSE(options: UseSSEOptions) {
  // 使用原生 fetch
  // 支持 ReadableStream 流式读取
  // 携带 Cookie (credentials: 'include')
  // 解析 data:{"d":"内容"} 格式
  // 检测 event: done 结束标识
}
```

**关键实现**：

```typescript
// composables/useSSE.ts
export function useSSE() {
  const connect = async (appId: number, message: string) => {
    const response = await fetch(
      `http://localhost:8080/app/chat/gen/code?appId=${appId}&message=${encodeURIComponent(message)}`,
      {
        method: 'GET',
        credentials: 'include',  // 携带 Cookie
        headers: {
          'Accept': 'text/event-stream'
        }
      }
    )

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader!.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data:')) {
          const jsonStr = line.substring(5).trim()
          if (jsonStr) {
            const { d } = JSON.parse(jsonStr)
            // d 就是实际内容
            yield d
          }
        } else if (line.includes('event: done')) {
          return // 传输结束
        }
      }
    }
  }

  return { connect }
}
```

**2. 预览沙箱**

创建 `components/PreviewFrame.vue`：

```typescript
// features:
// 1. 使用 iframe 承载生成内容
// 2. 初始 src 指向已部署的静态资源路径
// 3. 支持通过 postMessage 动态注入代码
// 4. 实现无刷新预览

interface PreviewFrameProps {
  appId: number
  deployKey?: string
  code?: string  // 新生成的代码
}
```

**更新预览的方式**：

```typescript
// 方式 1：刷新 iframe src（用于查看已部署的应用）
iframeRef.value.src = `http://localhost:8080/static/${deployKey}/`

// 方式 2：postMessage 注入代码（用于实时预览生成的代码）
iframeRef.value.contentWindow?.postMessage({
  type: 'UPDATE_CODE',
  code: generatedCode.value
}, '*')
```

iframe 内部需要监听消息：

```html
<script>
window.addEventListener('message', (event) => {
  if (event.data.type === 'UPDATE_CODE') {
    document.body.innerHTML = event.data.code
  }
})
</script>
```

**3. 聊天区功能**

- 消息列表自动滚动到底部
- AI 消息支持 Markdown 渲染（使用 `markdown-it` + `highlight.js`）
- 显示用户输入和 AI 响应

**4. 部署功能**

点击"部署"按钮：

```typescript
// POST /app/deploy
{
  "appId": number
}

// 响应
{
  "code": 0,
  "data": "/static/abc123/",  // 部署后的访问路径
  "message": "ok"
}
```

部署成功后：
- 弹窗显示部署成功
- 提供"访问应用"按钮，跳转到 `/static/{deployKey}/`

---

### 5.5 管理员模块（Admin）

#### /admin/users - 用户管理

**功能要求**：

1. 表格展示用户列表
2. 支持搜索（用户名、账号）
3. 删除用户操作

**API 调用**：

```typescript
// POST /user/list/page/vo
{
  "pageNum": 1,
  "pageSize": 10,
  "userName": "搜索关键词",
  "userAccount": "搜索关键词",
  "userRole": "user" | "admin" | "ban"
}
```

#### /admin/apps - 应用管理

**功能要求**：

1. 表格展示所有应用
2. 支持搜索（应用名称）
3. 编辑功能：
   - 修改封面
   - 修改优先级（设为精选：priority > 0）
   - 删除应用

**API 调用**：

```typescript
// POST /app/admin/list/page/vo
{
  "pageNum": 1,
  "pageSize": 10
}

// POST /app/admin/update
{
  "id": number,
  "appName": string,
  "cover": string,
  "priority": number  // > 0 表示精选
}

// POST /app/admin/delete
{
  "id": number
}
```

---

## 六、项目目录结构

```
src/
├── api/                    # API 请求封装
│   ├── index.ts           # Axios 实例配置（baseURL: '/'）
│   ├── user.ts            # 用户相关 API
│   ├── app.ts             # 应用相关 API
│   └── types.ts           # API 类型定义
│
├── assets/                # 静态资源
│   ├── images/
│   └── styles/
│       ├── global.less    # 全局样式
│       └── variables.less # 样式变量
│
├── components/            # 公共组件
│   ├── AppCard.vue        # 应用卡片
│   ├── PromptInput.vue    # 首页输入框
│   ├── PreviewFrame.vue   # 预览 iframe
│   └── MarkdownRenderer.vue # Markdown 渲染器
│
├── composables/           # 组合式函数
│   ├── useAuth.ts         # 认证相关
│   ├── useSSE.ts          # SSE 流式请求
│   └── usePreview.ts      # 预览相关
│
├── layouts/               # 布局组件
│   ├── BasicLayout.vue    # 基础布局
│   └── BlankLayout.vue    # 空白布局
│
├── router/                # 路由配置
│   └── index.ts           # 路由定义 + 权限守卫
│
├── stores/                # Pinia Store
│   ├── auth.ts            # 认证状态
│   ├── user.ts            # 用户状态
│   └── app.ts             # 应用状态
│
├── types/                 # TypeScript 类型定义
│   ├── common.ts          # 通用类型
│   ├── user.ts            # 用户类型
│   └── app.ts             # 应用类型
│
├── views/                 # 页面组件
│   ├── Home.vue           # 首页
│   ├── Login.vue          # 登录页
│   ├── Register.vue       # 注册页
│   ├── Portfolio.vue      # 作品集
│   ├── Editor.vue         # 编辑器
│   ├── Profile.vue        # 个人中心
│   └── admin/
│       ├── Users.vue      # 用户管理
│       └── Apps.vue       # 应用管理
│
├── App.vue                # 根组件
├── main.ts                # 入口文件
└── vite.config.ts         # Vite 配置
```

---

## 七、类型定义

### 7.1 通用类型（types/common.ts）

```typescript
interface BaseResponse<T> {
  code: number
  data: T
  message: string
}

interface PageRequest {
  pageNum: number
  pageSize: number
  sortField?: string
  sortOrder?: 'descend' | 'ascend'
}

interface PageResponse<T> {
  records: T[]
  pageNumber: number
  pageSize: number
  totalRow: number
}
```

### 7.2 用户类型（types/user.ts）

```typescript
interface User {
  id: number
  userAccount: string
  userName: string
  userAvatar: string
  userProfile: string
  userRole: 'user' | 'admin' | 'ban'
  createTime: string
  updateTime?: string
}

interface UserVO {
  id: number
  userAccount: string
  userName: string
  userAvatar: string
  userProfile: string
  userRole: string
  createTime: string
}

interface LoginUserVO extends UserVO {
  updateTime?: string
}

interface UserRegisterRequest {
  userAccount: string
  userPassword: string
  checkPassword: string
}

interface UserLoginRequest {
  userAccount: string
  userPassword: string
}

interface UserAddRequest {
  userName?: string
  userAccount: string
  userAvatar?: string
  userProfile?: string
  userRole?: string
}

interface UserUpdateRequest {
  id: number
  userName?: string
  userAvatar?: string
  userProfile?: string
  userRole?: string
}

interface UserQueryRequest extends PageRequest {
  id?: number
  userName?: string
  userAccount?: string
  userProfile?: string
  userRole?: string
}
```

### 7.3 应用类型（types/app.ts）

```typescript
interface App {
  id: number
  appName: string
  cover?: string
  initPrompt: string
  codeGenType: 'SINGLE_FILE' | 'MULTI_FILE'
  deployKey?: string
  deployedTime?: string
  priority: number
  userId: number
  createTime: string
  updateTime?: string
  editTime?: string
}

interface AppVO {
  id: number
  appName: string
  cover?: string
  initPrompt: string
  codeGenType: string
  deployKey?: string
  deployedTime?: string
  priority: number
  userId: number
  createTime: string
  updateTime?: string
  user?: UserVO
}

interface AppAddRequest {
  initPrompt: string
}

interface AppUpdateRequest {
  id: number
  appName?: string
}

interface AppAdminUpdateRequest {
  id: number
  appName?: string
  cover?: string
  priority?: number
}

interface AppQueryRequest extends PageRequest {
  id?: number
  appName?: string
  cover?: string
  initPrompt?: string
  codeGenType?: string
  deployKey?: string
  priority?: number
  userId?: number
}

interface AppDeployRequest {
  appId: number
}
```

---

## 八、开发注意事项

### 8.1 必须遵守的规范

1. **所有 API 请求 baseURL 必须是 `/`**（不是 `/api`）
2. **必须设置 `withCredentials: true`**（携带 Cookie）
3. **SSE 使用原生 fetch，不使用 Axios**
4. **所有组件使用 `<script setup lang="ts">`**
5. **禁止使用 `any` 类型**

### 8.2 跨域说明

后端已配置跨域支持（`CorsConfig.java`）：
- 允许所有来源
- 允许携带 Cookie
- 允许常用请求方法

前端只需正确配置 `withCredentials: true` 即可。

### 8.3 端口配置

| 环境 | 前端端口 | 后端端口 |
|------|---------|---------|
| 开发 | 5173 (Vite 默认) | 8080 |
| 生产 | 同服务器 | 8080 |

---

## 九、输出要求

请按以下顺序输出代码：

1. **项目目录结构**（完整的 src 目录树）
2. **核心 Store**：`stores/auth.ts`（登录/注销/权限判断）
3. **Composable**：`composables/useSSE.ts`（完整流式处理逻辑）
4. **API 配置**：`api/index.ts`（Axios 实例配置）
5. **路由配置**：`router/index.ts`（包含权限守卫）
6. **关键页面**：
   - `views/Login.vue`
   - `views/Home.vue`
   - `views/Editor.vue`
   - `components/PreviewFrame.vue`

所有输出必须是**完整文件内容**，不允许省略 import，不允许 TODO。
