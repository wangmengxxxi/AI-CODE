<template>
  <BasicLayout>
    <div class="user-manage-page">
      <a-card class="manage-card" :bordered="false">
        <div class="page-header">
          <h2 class="page-title">用户管理</h2>
          <a-button type="primary" @click="handleAdd">
            <template #icon><PlusOutlined /></template>
            添加用户
          </a-button>
        </div>

        <!-- Search Form -->
        <a-form layout="inline" class="search-form">
          <a-form-item label="账号">
            <a-input
              v-model:value="searchForm.userAccount"
              placeholder="请输入账号"
              allow-clear
              @pressEnter="handleSearch"
            />
          </a-form-item>
          <a-form-item label="昵称">
            <a-input
              v-model:value="searchForm.userName"
              placeholder="请输入昵称"
              allow-clear
              @pressEnter="handleSearch"
            />
          </a-form-item>
          <a-form-item label="角色">
            <a-select
              v-model:value="searchForm.userRole"
              placeholder="全部"
              allow-clear
              style="width: 120px"
            >
              <a-select-option value="user">普通用户</a-select-option>
              <a-select-option value="admin">管理员</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button type="primary" @click="handleSearch">
                <template #icon><SearchOutlined /></template>
                搜索
              </a-button>
              <a-button @click="handleReset">重置</a-button>
            </a-space>
          </a-form-item>
        </a-form>

        <!-- User Table -->
        <a-table
          :columns="columns"
          :data-source="userList"
          :loading="loading"
          :pagination="pagination"
          row-key="id"
          @change="handleTableChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'userAvatar'">
              <a-avatar :src="record.userAvatar || defaultAvatar(record.userAccount)" />
            </template>
            <template v-else-if="column.key === 'userRole'">
              <a-tag :color="record.userRole === 'admin' ? 'red' : 'blue'">
                {{ record.userRole === 'admin' ? '管理员' : '普通用户' }}
              </a-tag>
            </template>
            <template v-else-if="column.key === 'createTime'">
              {{ formatDate(record.createTime) }}
            </template>
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a-button type="link" size="small" @click="handleEdit(record)">
                  编辑
                </a-button>
                <a-popconfirm
                  title="确定删除该用户吗?"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="handleDelete(record.id)"
                >
                  <a-button type="link" danger size="small">删除</a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-card>

      <!-- Add/Edit Modal -->
      <a-modal
        v-model:open="modalVisible"
        :title="isEdit ? '编辑用户' : '添加用户'"
        :confirm-loading="modalLoading"
        @ok="handleModalOk"
        @cancel="handleModalCancel"
      >
        <a-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-form-item label="账号" name="userAccount" v-if="!isEdit">
            <a-input v-model:value="formData.userAccount" placeholder="请输入账号" />
          </a-form-item>
          <a-form-item label="账号" v-else>
            <a-input :value="formData.userAccount" disabled />
          </a-form-item>
          <a-form-item label="昵称" name="userName">
            <a-input v-model:value="formData.userName" placeholder="请输入昵称" />
          </a-form-item>
          <a-form-item label="头像URL" name="userAvatar">
            <a-input v-model:value="formData.userAvatar" placeholder="请输入头像链接" />
          </a-form-item>
          <a-form-item label="简介" name="userProfile">
            <a-textarea
              v-model:value="formData.userProfile"
              :rows="3"
              placeholder="请输入用户简介"
            />
          </a-form-item>
          <a-form-item label="角色" name="userRole">
            <a-select v-model:value="formData.userRole" placeholder="请选择角色">
              <a-select-option value="user">普通用户</a-select-option>
              <a-select-option value="admin">管理员</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </BasicLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons-vue'
import type { FormInstance, TablePaginationConfig } from 'ant-design-vue'
import BasicLayout from '@/layouts/BasicLayout.vue'
import {
  listUserVOByPageAPI,
  addUserAPI,
  updateUserAPI,
  deleteUserAPI,
} from '@/api/user'
import type { UserVO, UserAddRequest, UserUpdateRequest, UserQueryRequest } from '@/types/user'

// 表格列配置
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '头像', dataIndex: 'userAvatar', key: 'userAvatar', width: 80 },
  { title: '账号', dataIndex: 'userAccount', key: 'userAccount' },
  { title: '昵称', dataIndex: 'userName', key: 'userName' },
  { title: '角色', dataIndex: 'userRole', key: 'userRole', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  { title: '操作', key: 'action', width: 150 },
]

// 状态
const loading = ref(false)
const userList = ref<UserVO[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

// 搜索表单
const searchForm = reactive<Partial<UserQueryRequest>>({
  userAccount: '',
  userName: '',
  userRole: undefined,
})

// Modal 相关
const modalVisible = ref(false)
const modalLoading = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const editingId = ref<number | null>(null)

const formData = reactive<UserAddRequest & { id?: number }>({
  userAccount: '',
  userName: '',
  userAvatar: '',
  userProfile: '',
  userRole: 'user',
})

const formRules = {
  userAccount: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 4, max: 16, message: '账号长度为 4-16 位', trigger: 'blur' },
  ],
  userRole: [{ required: true, message: '请选择角色', trigger: 'change' }],
}

// 默认头像
const defaultAvatar = (account: string) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${account}`
}

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}

// 获取用户列表
const fetchUserList = async () => {
  try {
    loading.value = true
    const params: UserQueryRequest = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...searchForm,
    }
    const res = await listUserVOByPageAPI(params)
    if (res.code === 0 && res.data) {
      userList.value = res.data.records
      pagination.total = res.data.totalRow
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 表格分页变化
const handleTableChange = (pag: TablePaginationConfig) => {
  pagination.current = pag.current || 1
  pagination.pageSize = pag.pageSize || 10
  fetchUserList()
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  fetchUserList()
}

// 重置搜索
const handleReset = () => {
  searchForm.userAccount = ''
  searchForm.userName = ''
  searchForm.userRole = undefined
  pagination.current = 1
  fetchUserList()
}

// 添加用户
const handleAdd = () => {
  isEdit.value = false
  editingId.value = null
  Object.assign(formData, {
    userAccount: '',
    userName: '',
    userAvatar: '',
    userProfile: '',
    userRole: 'user',
  })
  modalVisible.value = true
}

// 编辑用户
const handleEdit = (record: UserVO) => {
  isEdit.value = true
  editingId.value = record.id
  Object.assign(formData, {
    userAccount: record.userAccount,
    userName: record.userName || '',
    userAvatar: record.userAvatar || '',
    userProfile: record.userProfile || '',
    userRole: record.userRole,
  })
  modalVisible.value = true
}

// Modal 确认
const handleModalOk = async () => {
  try {
    await formRef.value?.validate()
    modalLoading.value = true

    if (isEdit.value && editingId.value) {
      // 编辑用户
      const updateData: UserUpdateRequest = {
        id: editingId.value,
        userName: formData.userName,
        userAvatar: formData.userAvatar,
        userProfile: formData.userProfile,
        userRole: formData.userRole,
      }
      const res = await updateUserAPI(updateData)
      if (res.code === 0) {
        message.success('更新成功')
        modalVisible.value = false
        fetchUserList()
      }
    } else {
      // 添加用户
      const addData: UserAddRequest = {
        userAccount: formData.userAccount,
        userName: formData.userName,
        userAvatar: formData.userAvatar,
        userProfile: formData.userProfile,
        userRole: formData.userRole,
      }
      const res = await addUserAPI(addData)
      if (res.code === 0) {
        message.success('添加成功,默认密码为 12345678')
        modalVisible.value = false
        fetchUserList()
      }
    }
  } catch (error) {
    console.error('操作失败:', error)
  } finally {
    modalLoading.value = false
  }
}

// Modal 取消
const handleModalCancel = () => {
  formRef.value?.resetFields()
}

// 删除用户
const handleDelete = async (id: number) => {
  try {
    const res = await deleteUserAPI({ id })
    if (res.code === 0) {
      message.success('删除成功')
      fetchUserList()
    }
  } catch (error) {
    console.error('删除失败:', error)
  }
}

onMounted(() => {
  fetchUserList()
})
</script>

<style scoped lang="scss">
.user-manage-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.manage-card {
  background: rgba(30, 41, 59, 0.9);
  border-radius: 16px;

  :deep(.ant-card-body) {
    padding: 24px;
  }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.search-form {
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 8px;

  :deep(.ant-form-item) {
    margin-bottom: 0;
  }

  :deep(.ant-form-item-label > label) {
    color: rgba(255, 255, 255, 0.85);
  }

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

  :deep(.ant-input-affix-wrapper) {
    background: transparent !important;
    border-color: rgba(255, 255, 255, 0.2) !important;

    input {
      background: transparent !important;
      color: #fff !important;

      &::placeholder {
        color: rgba(255, 255, 255, 0.4);
      }
    }

    .ant-input-clear-icon {
      color: rgba(255, 255, 255, 0.5);
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

  :deep(.ant-select-selection-placeholder) {
    color: rgba(255, 255, 255, 0.4) !important;
  }

  :deep(.ant-select-arrow) {
    color: rgba(255, 255, 255, 0.5);
  }

  :deep(.ant-select-clear) {
    background: transparent;
    color: rgba(255, 255, 255, 0.5);
  }
}

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

// 分页样式 - 独立选择器确保生效
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

    &:hover {
      border-color: #1677ff !important;

      a {
        color: #1677ff !important;
      }
    }
  }

  .ant-pagination-item-active {
    background: #1677ff !important;
    border-color: #1677ff !important;

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

    &:hover button {
      border-color: #1677ff !important;
      color: #1677ff !important;
    }

    &.ant-pagination-disabled button {
      color: rgba(255, 255, 255, 0.3) !important;
      background: rgba(15, 23, 42, 0.3) !important;
    }
  }

  .ant-pagination-jump-prev,
  .ant-pagination-jump-next {
    .ant-pagination-item-container {
      .ant-pagination-item-ellipsis {
        color: rgba(255, 255, 255, 0.6) !important;
      }

      .ant-pagination-item-link-icon {
        color: #1677ff !important;
      }
    }
  }

  .ant-pagination-options {
    .ant-select-selector {
      background: rgba(15, 23, 42, 0.6) !important;
      border-color: rgba(255, 255, 255, 0.3) !important;
      color: #fff !important;
    }

    .ant-select-selection-item {
      color: #fff !important;
    }

    .ant-select-arrow {
      color: rgba(255, 255, 255, 0.6) !important;
    }

    .ant-pagination-options-quick-jumper {
      color: rgba(255, 255, 255, 0.85) !important;

      input {
        background: rgba(15, 23, 42, 0.6) !important;
        border-color: rgba(255, 255, 255, 0.3) !important;
        color: #fff !important;
      }
    }
  }
}

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

  .ant-modal-body {
    padding-top: 24px;
  }

  .ant-form-item-label > label {
    color: rgba(255, 255, 255, 0.85);
  }

  .ant-input,
  .ant-input-textarea textarea {
    background: transparent !important;
    border-color: rgba(255, 255, 255, 0.2) !important;
    color: #fff !important;

    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }
  }

  .ant-select-selector {
    background: transparent !important;
    border-color: rgba(255, 255, 255, 0.2) !important;
    color: #fff !important;
  }

  .ant-select-arrow {
    color: rgba(255, 255, 255, 0.5);
  }
}
</style>
