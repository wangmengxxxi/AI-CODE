<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { listUserByPage, deleteUser } from '@/api/user'
import type { UserVO, UserQueryRequest, PageResponse } from '@/types'

const loading = ref(false)
const users = ref<UserVO[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

const searchForm = reactive<UserQueryRequest>({
  pageNum: 1,
  pageSize: 10,
  userName: '',
  userAccount: '',
  userRole: undefined
})

// 表格列
const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '账号', dataIndex: 'userAccount' },
  { title: '昵称', dataIndex: 'userName' },
  { title: '角色', dataIndex: 'userRole', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '操作', key: 'action', width: 100 }
]

// 角色选项
const roleOptions = [
  { value: '', label: '全部' },
  { value: 'user', label: '普通用户' },
  { value: 'admin', label: '管理员' },
  { value: 'ban', label: '已禁用' }
]

// 加载用户列表
async function loadUsers() {
  loading.value = true
  try {
    const res = await listUserByPage({
      ...searchForm,
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    })
    if (res.data.code === 0) {
      const data = res.data.data as PageResponse<UserVO>
      users.value = data.records
      pagination.total = data.totalRow
    }
  } catch (error) {
    console.error('加载用户失败', error)
  } finally {
    loading.value = false
  }
}

// 搜索
function handleSearch() {
  pagination.current = 1
  loadUsers()
}

// 删除用户
function handleDelete(user: UserVO) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除用户「${user.userName || user.userAccount}」吗？`,
    okType: 'danger',
    async onOk() {
      try {
        const res = await deleteUser({ id: user.id })
        if (res.data.code === 0) {
          message.success('删除成功')
          loadUsers()
        } else {
          message.error(res.data.message || '删除失败')
        }
      } catch (error) {
        message.error('删除失败')
      }
    }
  })
}

// 分页变化
function handleTableChange(pag: { current: number; pageSize: number }) {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  loadUsers()
}

onMounted(() => {
  loadUsers()
})
</script>

<template>
  <div class="admin-users-page">
    <a-card title="用户管理">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <a-space>
          <a-input
            v-model:value="searchForm.userName"
            placeholder="用户名"
            style="width: 150px"
            @pressEnter="handleSearch"
          />
          <a-input
            v-model:value="searchForm.userAccount"
            placeholder="账号"
            style="width: 150px"
            @pressEnter="handleSearch"
          />
          <a-select
            v-model:value="searchForm.userRole"
            placeholder="角色"
            style="width: 120px"
            :options="roleOptions"
          />
          <a-button type="primary" @click="handleSearch">
            <SearchOutlined /> 搜索
          </a-button>
        </a-space>
      </div>

      <!-- 表格 -->
      <a-table
        :columns="columns"
        :data-source="users"
        :loading="loading"
        :pagination="{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total: number) => `共 ${total} 条`
        }"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'userRole'">
            <a-tag :color="record.userRole === 'admin' ? 'purple' : record.userRole === 'ban' ? 'red' : 'blue'">
              {{ record.userRole === 'admin' ? '管理员' : record.userRole === 'ban' ? '已禁用' : '普通用户' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-button
              type="link"
              danger
              size="small"
              @click="handleDelete(record)"
            >
              <DeleteOutlined /> 删除
            </a-button>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<style scoped lang="less">
.admin-users-page {
  padding: 24px;
}

.search-bar {
  margin-bottom: 16px;
}
</style>
