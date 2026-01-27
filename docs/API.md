# AI Code 接口文档

## 基本信息

- **Base URL**: `http://localhost:8080`
- **Content-Type**: `application/json`

## 通用数据结构

### BaseResponse 统一响应结构

所有接口（除 SSE 流式接口外）均返回以下格式：

```json
{
  "code": 0,
  "data": {},
  "message": "ok"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| code | int | 状态码，0 表示成功 |
| data | T | 返回数据 |
| message | string | 提示信息 |

### 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 40000 | 请求参数错误 |
| 40100 | 未登录 |
| 40101 | 无权限 |
| 40400 | 请求数据不存在 |
| 40300 | 禁止访问 |
| 50000 | 系统内部异常 |
| 50001 | 操作失败 |

### 分页请求参数 PageRequest

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| pageNum | int | 否 | 1 | 当前页号 |
| pageSize | int | 否 | 10 | 每页数量 |
| sortField | string | 否 | - | 排序字段 |
| sortOrder | string | 否 | descend | 排序顺序（descend/ascend） |

### 分页响应结构

```json
{
  "code": 0,
  "data": {
    "records": [],
    "pageNumber": 1,
    "pageSize": 10,
    "totalRow": 100
  },
  "message": "ok"
}
```

---

## 1. 健康检查接口

### 1.1 健康检查

**接口**: `GET /health/`

**说明**: 检查服务是否正常运行

**请求**: 无需参数

**响应**:
```
ok
```

---

## 2. 用户模块接口

### 2.1 用户注册

**接口**: `POST /user/register`

**权限**: 无需登录

**请求参数**:

```json
{
  "userAccount": "string",
  "userPassword": "string",
  "checkPassword": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userAccount | string | 是 | 用户账号 |
| userPassword | string | 是 | 用户密码 |
| checkPassword | string | 是 | 确认密码 |

**响应**:

```json
{
  "code": 0,
  "data": 123456,
  "message": "ok"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| data | long | 新注册用户的 ID |

---

### 2.2 用户登录

**接口**: `POST /user/login`

**权限**: 无需登录

**请求参数**:

```json
{
  "userAccount": "string",
  "userPassword": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userAccount | string | 是 | 用户账号 |
| userPassword | string | 是 | 用户密码 |

**响应**:

```json
{
  "code": 0,
  "data": {
    "id": 1,
    "userAccount": "admin",
    "userName": "管理员",
    "userAvatar": "https://...",
    "userProfile": "个人简介",
    "userRole": "admin",
    "createTime": "2024-01-01T00:00:00",
    "updateTime": "2024-01-01T00:00:00"
  },
  "message": "ok"
}
```

**LoginUserVO 字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | long | 用户 ID |
| userAccount | string | 账号 |
| userName | string | 用户昵称 |
| userAvatar | string | 用户头像 URL |
| userProfile | string | 用户简介 |
| userRole | string | 用户角色：user/admin |
| createTime | LocalDateTime | 创建时间 |
| updateTime | LocalDateTime | 更新时间 |

---

### 2.3 获取当前登录用户

**接口**: `GET /user/get/login`

**权限**: 需要登录（通过 Cookie 中的 session）

**请求**: 无需参数

**响应**: 同 2.2 登录响应结构

---

### 2.4 用户登出

**接口**: `POST /user/logout`

**权限**: 需要登录

**请求**: 无需参数

**响应**:

```json
{
  "code": 0,
  "data": true,
  "message": "ok"
}
```

---

### 2.5 创建用户（管理员）

**接口**: `POST /user/add`

**权限**: 需要管理员权限

**请求参数**:

```json
{
  "userName": "string",
  "userAccount": "string",
  "userAvatar": "string",
  "userProfile": "string",
  "userRole": "user"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userName | string | 否 | 用户昵称 |
| userAccount | string | 是 | 账号 |
| userAvatar | string | 否 | 用户头像 URL |
| userProfile | string | 否 | 用户简介 |
| userRole | string | 否 | 用户角色：user/admin |

**注意**: 默认密码为 `12345678`

**响应**:

```json
{
  "code": 0,
  "data": 123456,
  "message": "ok"
}
```

---

### 2.6 根据 ID 获取用户（管理员）

**接口**: `GET /user/get`

**权限**: 需要管理员权限

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | long | 是 | 用户 ID |

**响应**:

```json
{
  "code": 0,
  "data": {
    "id": 1,
    "userAccount": "admin",
    "userPassword": "加密密码",
    "userName": "管理员",
    ...
  },
  "message": "ok"
}
```

---

### 2.7 根据 ID 获取用户 VO

**接口**: `GET /user/get/vo`

**权限**: 需要管理员权限

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | long | 是 | 用户 ID |

**响应**:

```json
{
  "code": 0,
  "data": {
    "id": 1,
    "userAccount": "admin",
    "userName": "管理员",
    "userAvatar": "https://...",
    "userProfile": "个人简介",
    "userRole": "admin",
    "createTime": "2024-01-01T00:00:00"
  },
  "message": "ok"
}
```

**UserVO 字段说明**: 与 LoginUserVO 类似，不包含 updateTime

---

### 2.8 删除用户（管理员）

**接口**: `POST /user/delete`

**权限**: 需要管理员权限

**请求参数**:

```json
{
  "id": 123
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | long | 是 | 要删除的用户 ID |

**响应**:

```json
{
  "code": 0,
  "data": true,
  "message": "ok"
}
```

---

### 2.9 更新用户（管理员）

**接口**: `POST /user/update`

**权限**: 需要管理员权限

**请求参数**:

```json
{
  "id": 123,
  "userName": "新昵称",
  "userAvatar": "https://...",
  "userProfile": "新简介",
  "userRole": "admin"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | long | 是 | 用户 ID |
| userName | string | 否 | 用户昵称 |
| userAvatar | string | 否 | 用户头像 URL |
| userProfile | string | 否 | 用户简介 |
| userRole | string | 否 | 用户角色：user/admin |

**响应**:

```json
{
  "code": 0,
  "data": true,
  "message": "ok"
}
```

---

### 2.10 分页获取用户列表（管理员）

**接口**: `POST /user/list/page/vo`

**权限**: 需要管理员权限

**请求参数**:

```json
{
  "pageNum": 1,
  "pageSize": 10,
  "id": 1,
  "userName": "用户名",
  "userAccount": "账号",
  "userProfile": "简介",
  "userRole": "user"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pageNum | int | 否 | 当前页号，默认 1 |
| pageSize | int | 否 | 每页数量，默认 10 |
| id | long | 否 | 用户 ID 精确查询 |
| userName | string | 否 | 用户名模糊查询 |
| userAccount | string | 否 | 账号模糊查询 |
| userProfile | string | 否 | 简介模糊查询 |
| userRole | string | 否 | 角色精确查询：user/admin/ban |

**响应**:

```json
{
  "code": 0,
  "data": {
    "records": [
      {
        "id": 1,
        "userAccount": "admin",
        "userName": "管理员",
        "userAvatar": "https://...",
        "userProfile": "简介",
        "userRole": "admin",
        "createTime": "2024-01-01T00:00:00"
      }
    ],
    "pageNumber": 1,
    "pageSize": 10,
    "totalRow": 100
  },
  "message": "ok"
}
```

---

## 3. 应用模块接口

### 3.1 创建应用

**接口**: `POST /app/add`

**权限**: 需要登录

**请求参数**:

```json
{
  "initPrompt": "创建一个待办事项应用"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| initPrompt | string | 是 | 应用初始化的 prompt 描述 |

**响应**:

```json
{
  "code": 0,
  "data": 123,
  "message": "ok"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| data | long | 新创建应用的 ID |

**注意**:
- 应用名称会自动生成为 initPrompt 的前 12 位
- 默认代码生成类型为多文件模式

---

### 3.2 删除应用

**接口**: `POST /app/delete`

**权限**: 需要登录，仅本人或管理员可删除

**请求参数**:

```json
{
  "id": 123
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | long | 是 | 要删除的应用 ID |

**响应**:

```json
{
  "code": 0,
  "data": true,
  "message": "ok"
}
```

---

### 3.3 更新应用

**接口**: `POST /app/update`

**权限**: 需要登录，仅本人可更新

**请求参数**:

```json
{
  "id": 123,
  "appName": "待办事项应用"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | long | 是 | 应用 ID |
| appName | string | 否 | 应用名称 |

**注意**: 用户只能更新应用名称

**响应**:

```json
{
  "code": 0,
  "data": true,
  "message": "ok"
}
```

---

### 3.4 根据 ID 获取应用详情

**接口**: `GET /app/get/vo`

**权限**: 无需登录

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | long | 是 | 应用 ID |

**响应**:

```json
{
  "code": 0,
  "data": {
    "id": 1,
    "appName": "待办事项应用",
    "cover": "https://...",
    "initPrompt": "创建一个待办事项应用",
    "codeGenType": "MULTI_FILE",
    "deployKey": "abc123",
    "deployedTime": "2024-01-01T00:00:00",
    "priority": 0,
    "userId": 1,
    "createTime": "2024-01-01T00:00:00",
    "updateTime": "2024-01-01T00:00:00",
    "user": {
      "id": 1,
      "userAccount": "admin",
      "userName": "管理员",
      "userAvatar": "https://...",
      "userProfile": "简介",
      "userRole": "admin",
      "createTime": "2024-01-01T00:00:00"
    }
  },
  "message": "ok"
}
```

**AppVO 字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | long | 应用 ID |
| appName | string | 应用名称 |
| cover | string | 应用封面 URL |
| initPrompt | string | 应用初始化 prompt |
| codeGenType | string | 代码生成类型：SINGLE_FILE/MULTI_FILE |
| deployKey | string | 部署标识 |
| deployedTime | LocalDateTime | 部署时间 |
| priority | int | 优先级（用于精选应用） |
| userId | long | 创建用户 ID |
| createTime | LocalDateTime | 创建时间 |
| updateTime | LocalDateTime | 更新时间 |
| user | UserVO | 创建用户信息 |

---

### 3.5 分页获取我的应用列表

**接口**: `POST /app/my/list/page/vo`

**权限**: 需要登录

**请求参数**:

```json
{
  "pageNum": 1,
  "pageSize": 20,
  "appName": "待办",
  "id": 1
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pageNum | int | 否 | 当前页号，默认 1 |
| pageSize | int | 否 | 每页数量，默认 10，最大 20 |
| id | long | 否 | 应用 ID 精确查询 |
| appName | string | 否 | 应用名称模糊查询 |
| cover | string | 否 | 封面模糊查询 |
| initPrompt | string | 否 | prompt 模糊查询 |
| codeGenType | string | 否 | 代码生成类型 |
| deployKey | string | 否 | 部署标识 |
| priority | int | 否 | 优先级 |

**注意**:
- 只返回当前登录用户创建的应用
- userId 会被自动设置为当前登录用户 ID

**响应**:

```json
{
  "code": 0,
  "data": {
    "records": [/* AppVO 数组 */],
    "pageNumber": 1,
    "pageSize": 20,
    "totalRow": 50
  },
  "message": "ok"
}
```

---

### 3.6 分页获取精选应用列表

**接口**: `POST /app/good/list/page/vo`

**权限**: 无需登录

**请求参数**:

```json
{
  "pageNum": 1,
  "pageSize": 20
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pageNum | int | 否 | 当前页号，默认 1 |
| pageSize | int | 否 | 每页数量，默认 10，最大 20 |
| 其他查询条件 | - | 否 | 同 3.5 |

**注意**: 只返回 priority > 0 的精选应用

**响应**: 同 3.5

---

### 3.7 管理员删除应用

**接口**: `POST /app/admin/delete`

**权限**: 需要管理员权限

**请求参数**:

```json
{
  "id": 123
}
```

**响应**:

```json
{
  "code": 0,
  "data": true,
  "message": "ok"
}
```

---

### 3.8 管理员更新应用

**接口**: `POST /app/admin/update`

**权限**: 需要管理员权限

**请求参数**:

```json
{
  "id": 123,
  "appName": "应用名称",
  "cover": "https://...",
  "priority": 1
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | long | 是 | 应用 ID |
| appName | string | 否 | 应用名称 |
| cover | string | 否 | 应用封面 URL |
| priority | int | 否 | 优先级（设为非 0 值可设为精选） |

**响应**:

```json
{
  "code": 0,
  "data": true,
  "message": "ok"
}
```

---

### 3.9 管理员获取应用详情

**接口**: `GET /app/admin/get/vo`

**权限**: 需要管理员权限

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | long | 是 | 应用 ID |

**响应**: 同 3.4

---

### 3.10 管理员分页获取应用列表

**接口**: `POST /app/admin/list/page/vo`

**权限**: 需要管理员权限

**请求参数**: 同 3.5

**响应**: 同 3.5

---

### 3.11 AI 对话生成代码（SSE 流式接口）⭐

**接口**: `GET /app/chat/gen/code`

**权限**: 需要登录

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| appId | long | 是 | 应用 ID |
| message | string | 是 | 用户消息/需求描述 |

**响应类型**: `text/event-stream` (SSE)

**数据格式**:

每个数据块格式为：
```
data:{"d":"生成的代码片段"}

```

**流式响应示例**:
```
data:{"d":"<"}
data:{"d":"!DOCTYPE html>"}
data:{"d":"<html>"}
...
event: done
data:

```

**SSE 解析说明**:

1. **数据行解析**: 每行以 `data:` 开头，后面跟着 JSON 字符串
2. **JSON 结构**: `{"d": "内容"}`，其中 `d` 字段包含实际内容
3. **结束标识**: 当收到 `event: done` 时表示流式传输结束

**前端处理示例**:

```javascript
const eventSource = new EventSource('/api/app/chat/gen/code?appId=1&message=创建登录页面');

eventSource.onmessage = (event) => {
  const jsonData = JSON.parse(event.data);
  const content = jsonData.d; // 获取实际内容
  console.log(content);
  // 追加到页面或处理
};

eventSource.addEventListener('done', () => {
  console.log('传输完成');
  eventSource.close();
});

eventSource.onerror = (error) => {
  console.error('SSE error:', error);
  eventSource.close();
};
```

**Fetch API 处理示例**:

```javascript
fetch('/api/app/chat/gen/code?appId=1&message=创建登录页面')
  .then(response => {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    function read() {
      reader.read().then(({ done, value }) => {
        if (done) return;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const jsonData = JSON.parse(line.substring(5));
            const content = jsonData.d;
            // 处理内容
          }
        }

        read();
      });
    }

    read();
  });
```

---

### 3.12 部署应用

**接口**: `POST /app/deploy`

**权限**: 需要登录

**请求参数**:

```json
{
  "appId": 123
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| appId | long | 是 | 要部署的应用 ID |

**响应**:

```json
{
  "code": 0,
  "data": "/static/abc123/",
  "message": "ok"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| data | string | 部署后的访问路径 |

---

## 4. 静态资源访问接口

### 4.1 访问部署的应用

**接口**: `GET /static/{deployKey}/**`

**权限**: 无需登录

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| deployKey | string | 是 | 应用的部署标识 |
| fileName | string | 否 | 要访问的文件名 |

**访问示例**:
- 访问应用首页: `/static/abc123/` 或 `/static/abc123`
- 访问具体文件: `/static/abc123/index.html`
- 访问子目录: `/static/abc123/css/style.css`

**注意**:
- 不带斜杠访问会自动重定向到带斜杠的 URL
- 默认返回 `index.html`

---

## 附录：枚举类型说明

### 用户角色 (userRole)

| 值 | 说明 |
|----|------|
| user | 普通用户 |
| admin | 管理员 |
| ban | 被封禁 |

### 代码生成类型 (codeGenType)

| 值 | 说明 |
|----|------|
| SINGLE_FILE | 单文件模式 |
| MULTI_FILE | 多文件模式（默认） |

---

## 认证说明

### Cookie 认证

- 登录成功后，会在 Cookie 中设置 session
- 后续请求会自动携带 Cookie 进行身份验证
- 部分接口（如获取当前登录用户）依赖此认证方式

### 权限控制

- 部分接口使用 `@AuthCheck` 注解进行权限控制
- `mustRole = "admin"` 表示需要管理员权限
- 接口文档中已标注各接口的权限要求

---

## 前端开发注意事项

1. **SSE 流式接口处理**: 务必正确解析 `data:{"d":"..."}` 格式
2. **时间格式**: 所有时间字段为 ISO 8601 格式
3. **分页参数**: 建议使用前端分页组件的默认值
4. **错误处理**: 统一处理 BaseResponse 中的 code 字段
5. **文件上传**: 静态资源访问路径格式为 `/static/{deployKey}/{fileName}`
