<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { SearchOutlined, EditOutlined, DeleteOutlined, StarOutlined } from '@ant-design/icons-vue'
import { adminListAppByPage, adminDeleteApp, adminUpdateApp } from '@/api/app'
import type { AppVO, AppQueryRequest, PageResponse } from '@/types'

const router = useRouter()

const loading = ref(false)
const apps = ref<AppVO[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

const searchForm = reactive<AppQueryRequest>({
  pageNum: 1,
  pageSize: 10,
  appName: ''
})

// 表格列
const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '应用名称', dataIndex: 'appName' },
  { title: '创建者ID', dataIndex: 'userId', width: 100 },
  { title: '优先级', dataIndex: 'priority', width: 80 },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '操作', key: 'action', width: 200 }
]

// 加载应用列表
async function loadApps() {
  loading.value = true
  try {
    const res = await adminListAppByPage({
      ...searchForm,
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    })
    if (res.data.code === 0) {
      const data = res.data.data as PageResponse<AppVO>
      apps.value = data.records
      pagination.total = data.totalRow
    }
  } catch (error) {
    console.error('加载应用失败', error)
  } finally {
    loading.value = false
  }
}

// 搜索
function handleSearch() {
  pagination.current = 1
  loadApps()
}

// 编辑
function handleEdit(app: AppVO) {
  router.push(`/app/edit/${app.id}`)
}

// 删除
function handleDelete(app: AppVO) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除应用「${app.appName}」吗？`,
    okType: 'danger',
    async onOk() {
      try {
        const res = await adminDeleteApp({ id: app.id })
        if (res.data.code === 0) {
          message.success('删除成功')
          loadApps()
        } else {
          message.error(res.data.message || '删除失败')
        }
      } catch (error) {
        message.error('删除失败')
      }
    }
  })
}

// 设为精选
async function handleSetFeatured(app: AppVO) {
  try {
    const res = await adminUpdateApp({
      id: app.id,
      priority: app.priority > 0 ? 0 : 99
    })
    if (res.data.code === 0) {
      message.success(app.priority > 0 ? '已取消精选' : '已设为精选')
      loadApps()
    } else {
      message.error(res.data.message || '操作失败')
    }
  } catch (error) {
    message.error('操作失败')
  }
}

// 分页变化
function handleTableChange(pag: { current: number; pageSize: number }) {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  loadApps()
}

onMounted(() => {
  loadApps()
})
</script>

<template>
  <div class="admin-apps-page">
    <a-card title="应用管理">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <a-space>
          <a-input
            v-model:value="searchForm.appName"
            placeholder="应用名称"
            style="width: 200px"
            @pressEnter="handleSearch"
          />
          <a-button type="primary" @click="handleSearch">
            <SearchOutlined /> 搜索
          </a-button>
        </a-space>
      </div>

      <!-- 表格 -->
      <a-table
        :columns="columns"
        :data-source="apps"
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
          <template v-if="column.dataIndex === 'priority'">
            <a-tag v-if="record.priority > 0" color="gold">精选</a-tag>
            <span v-else>{{ record.priority }}</span>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleEdit(record)">
                <EditOutlined /> 编辑
              </a-button>
              <a-button type="link" size="small" @click="handleSetFeatured(record)">
                <StarOutlined /> {{ record.priority > 0 ? '取消精选' : '精选' }}
              </a-button>
              <a-button type="link" danger size="small" @click="handleDelete(record)">
                <DeleteOutlined /> 删除
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<style scoped lang="less">
.admin-apps-page {
  padding: 24px;
}

.search-bar {
  margin-bottom: 16px;
}
</style>
