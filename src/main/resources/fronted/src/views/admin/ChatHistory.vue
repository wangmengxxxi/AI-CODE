<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { adminListChatHistoryByPage } from '@/api/chatHistory'
import type { ChatHistory, ChatHistoryQueryRequest, PageResponse } from '@/types'

const loading = ref(false)
const chatHistoryList = ref<ChatHistory[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

const searchForm = reactive<ChatHistoryQueryRequest>({
  pageNum: 1,
  pageSize: 10,
  appId: undefined,
  message: undefined,
  messageType: undefined
})

// 表格列
const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '应用ID', dataIndex: 'appId', width: 100 },
  { title: '用户ID', dataIndex: 'userId', width: 100 },
  { title: '消息类型', dataIndex: 'messageType', width: 100 },
  { title: '消息内容', dataIndex: 'message', ellipsis: true },
  { title: '创建时间', dataIndex: 'createTime', width: 180 }
]

// 加载对话历史列表
async function loadChatHistory() {
  loading.value = true
  try {
    const res = await adminListChatHistoryByPage({
      ...searchForm,
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    })
    if (res.data.code === 0) {
      const data = res.data.data as PageResponse<ChatHistory>
      chatHistoryList.value = data.records
      pagination.total = data.totalRow
    }
  } catch (error) {
    console.error('加载对话历史失败', error)
  } finally {
    loading.value = false
  }
}

// 搜索
function handleSearch() {
  pagination.current = 1
  loadChatHistory()
}

// 分页变化
function handleTableChange(pag: { current: number; pageSize: number }) {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  loadChatHistory()
}

// 消息类型格式化
function formatMessageType(type: string) {
  return type === 'user' ? '用户' : 'AI'
}

// 消息类型标签颜色
function getMessageTypeColor(type: string) {
  return type === 'user' ? 'blue' : 'green'
}

onMounted(() => {
  loadChatHistory()
})
</script>

<template>
  <div class="admin-chat-history-page">
    <a-card title="对话历史管理">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <a-space>
          <a-input
            v-model:value="searchForm.appId"
            placeholder="应用ID"
            style="width: 120px"
            type="number"
            @pressEnter="handleSearch"
          />
          <a-select
            v-model:value="searchForm.messageType"
            placeholder="消息类型"
            style="width: 120px"
            allowClear
          >
            <a-select-option value="user">用户</a-select-option>
            <a-select-option value="ai">AI</a-select-option>
          </a-select>
          <a-input
            v-model:value="searchForm.message"
            placeholder="消息内容"
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
        :data-source="chatHistoryList"
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
          <template v-if="column.dataIndex === 'messageType'">
            <a-tag :color="getMessageTypeColor(record.messageType)">
              {{ formatMessageType(record.messageType) }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'message'">
            <a-tooltip :title="record.message">
              <span class="message-text">{{ record.message }}</span>
            </a-tooltip>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<style scoped lang="less">
.admin-chat-history-page {
  padding: 24px;
}

.search-bar {
  margin-bottom: 16px;
}

.message-text {
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}
</style>
