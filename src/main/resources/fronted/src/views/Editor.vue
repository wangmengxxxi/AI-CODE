<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { 
  SendOutlined, 
  RocketOutlined, 
  ArrowLeftOutlined,
  EditOutlined
} from '@ant-design/icons-vue'
import { useSSE } from '@/composables/useSSE'
import { getAppVoById, deployApp, updateApp } from '@/api/app'
import { extractHtmlCode } from '@/utils/htmlExtractor'
import type { AppVO, ChatMessage } from '@/types'

const route = useRoute()
const router = useRouter()
const { isLoading: sseLoading, connect } = useSSE()

// 应用信息
const app = ref<AppVO | null>(null)
const appLoading = ref(false)

// 聊天消息
const messages = ref<ChatMessage[]>([])
const inputMessage = ref('')

// 生成的代码
const generatedCode = ref('')

// 部署状态
const deploying = ref(false)

// 应用 ID
const appId = computed(() => Number(route.params.id))

// 预览 URL
const previewUrl = computed(() => {
  if (app.value?.deployKey) {
    return `http://localhost:8080/static/${app.value.deployKey}/`
  }
  return ''
})

// 计算可预览的 HTML 代码
const previewHtml = computed(() => {
  return extractHtmlCode(generatedCode.value)
})

// 加载应用信息
async function loadApp() {
  appLoading.value = true
  try {
    const res = await getAppVoById(appId.value)
    if (res.data.code === 0) {
      app.value = res.data.data
      
      // 如果是首次进入且有初始 prompt，自动发送
      if (app.value.initPrompt && messages.value.length === 0) {
        inputMessage.value = app.value.initPrompt
        handleSend()
      }
    } else {
      message.error(res.data.message || '加载应用失败')
    }
  } catch (error) {
    message.error('加载应用失败')
  } finally {
    appLoading.value = false
  }
}

// 发送消息
async function handleSend() {
  const text = inputMessage.value.trim()
  if (!text) return
  
  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: text,
    timestamp: Date.now()
  })
  
  inputMessage.value = ''
  generatedCode.value = ''
  
  // 添加 AI 消息占位
  const aiMessageIndex = messages.value.length
  messages.value.push({
    role: 'assistant',
    content: '',
    timestamp: Date.now()
  })
  
  // 调用 SSE 接口
  await connect(
    appId.value,
    text,
    (chunk) => {
      // 追加内容
      messages.value[aiMessageIndex].content += chunk
      generatedCode.value += chunk
    },
    () => {
      // 完成
      updatePreview()
    },
    (err) => {
      message.error(`生成失败: ${err.message}`)
    }
  )
}

// 更新预览
function updatePreview() {
  const iframe = document.querySelector('.preview-iframe') as HTMLIFrameElement
  if (iframe && iframe.contentWindow) {
    // 使用 srcdoc 更新内容
    iframe.srcdoc = generatedCode.value
  }
}

// 部署应用
async function handleDeploy() {
  deploying.value = true
  try {
    const res = await deployApp({ appId: appId.value })
    if (res.data.code === 0) {
      const deployPath = res.data.data
      Modal.success({
        title: '部署成功',
        content: `应用已成功部署！访问地址：${window.location.origin}${deployPath}`,
        okText: '访问应用',
        onOk() {
          window.open(deployPath, '_blank')
        }
      })
      // 刷新应用信息
      loadApp()
    } else {
      message.error(res.data.message || '部署失败')
    }
  } catch (error) {
    message.error('部署失败')
  } finally {
    deploying.value = false
  }
}

// 返回首页
function goBack() {
  router.push('/')
}

// 编辑应用名称
function handleEditName() {
  if (!app.value) return
  
  Modal.confirm({
    title: '修改应用名称',
    content: () => {
      const input = document.createElement('input')
      input.type = 'text'
      input.value = app.value?.appName || ''
      input.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 4px;'
      input.id = 'app-name-input'
      return input
    },
    async onOk() {
      const input = document.getElementById('app-name-input') as HTMLInputElement
      if (input && input.value.trim()) {
        try {
          const res = await updateApp({
            id: appId.value,
            appName: input.value.trim()
          })
          if (res.data.code === 0) {
            message.success('修改成功')
            loadApp()
          } else {
            message.error(res.data.message || '修改失败')
          }
        } catch (error) {
          message.error('修改失败')
        }
      }
    }
  })
}

onMounted(() => {
  loadApp()
})
</script>

<template>
  <div class="editor-page">
    <!-- 顶部栏 -->
    <div class="editor-header">
      <div class="header-left">
        <a-button type="text" @click="goBack">
          <ArrowLeftOutlined />
        </a-button>
        <div class="app-name" @click="handleEditName">
          <span>🤖</span>
          <span>{{ app?.appName || '加载中...' }}</span>
          <EditOutlined class="edit-icon" />
        </div>
      </div>
      <div class="header-right">
        <a-button 
          type="primary" 
          :loading="deploying"
          @click="handleDeploy"
        >
          <RocketOutlined />
          部署
        </a-button>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="editor-content">
      <!-- 左侧对话区 -->
      <div class="chat-panel">
        <!-- 消息列表 -->
        <div class="message-list">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="['message-item', msg.role]"
          >
            <div class="message-content">
              <template v-if="msg.role === 'assistant'">
                <div class="ai-badge">AI 回复</div>
              </template>
              <div class="message-text">{{ msg.content }}</div>
            </div>
          </div>
          
          <div v-if="sseLoading" class="loading-indicator">
            <a-spin size="small" />
            <span>AI 正在思考...</span>
          </div>
        </div>

        <!-- 输入区 -->
        <div class="input-area">
          <a-textarea
            v-model:value="inputMessage"
            :auto-size="{ minRows: 2, maxRows: 6 }"
            placeholder="描述越详细，页面越精具体，可以一步一步完善生成效果"
            @pressEnter.ctrl="handleSend"
          />
          <div class="input-actions">
            <div class="left-tools">
              <a-button size="small">📎 上传</a-button>
              <a-button size="small">✏️ 编辑</a-button>
              <a-button size="small">✨ 优化</a-button>
            </div>
            <a-button
              type="primary"
              shape="circle"
              :loading="sseLoading"
              :disabled="!inputMessage.trim()"
              @click="handleSend"
            >
              <template #icon><SendOutlined /></template>
            </a-button>
          </div>
        </div>
      </div>

      <!-- 右侧预览区 -->
      <div class="preview-panel">
        <div class="preview-header">
          <span>生成后的网页展示</span>
          <a-tag v-if="sseLoading" color="processing">实时生成中...</a-tag>
          <a-tag v-else-if="previewHtml" color="success">预览就绪</a-tag>
        </div>
        <div class="preview-content">
          <!-- 已部署的应用使用 src -->
          <iframe
            v-if="previewUrl"
            class="preview-iframe"
            :src="previewUrl"
            sandbox="allow-scripts allow-same-origin"
          />
          <!-- 生成的代码使用 srcdoc -->
          <iframe
            v-else-if="previewHtml"
            class="preview-iframe"
            :srcdoc="previewHtml"
            sandbox="allow-scripts allow-same-origin"
          />
          <!-- 正在生成中 -->
          <div v-else-if="sseLoading" class="preview-loading">
            <a-spin size="large" />
            <p>AI 正在生成代码，预览将在生成完成后显示...</p>
          </div>
          <!-- 空状态 -->
          <a-empty v-else description="代码生成完成后将在此展示预览" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.editor-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  background: #f5f5f5;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-name {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  
  &:hover {
    background: #f5f5f5;
    
    .edit-icon {
      opacity: 1;
    }
  }
  
  .edit-icon {
    opacity: 0;
    font-size: 12px;
    color: #999;
    transition: opacity 0.3s;
  }
}

.editor-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.chat-panel {
  width: 400px;
  min-width: 350px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: 1px solid #e8e8e8;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.message-item {
  margin-bottom: 16px;
  
  &.user {
    text-align: right;
    
    .message-content {
      display: inline-block;
      text-align: left;
      background: #f0f0f0;
      border-radius: 8px;
      padding: 12px 16px;
      max-width: 80%;
    }
  }
  
  &.assistant {
    .message-content {
      background: #fff;
      border: 1px solid #e8e8e8;
      border-radius: 8px;
      padding: 12px 16px;
    }
  }
}

.ai-badge {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.message-text {
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 14px;
  line-height: 1.6;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #999;
  font-size: 14px;
}

.input-area {
  padding: 16px;
  border-top: 1px solid #e8e8e8;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.left-tools {
  display: flex;
  gap: 8px;
}

.preview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  font-weight: 500;
}

.preview-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #999;
  
  p {
    margin: 0;
    font-size: 14px;
  }
}

.preview-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow: hidden;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
</style>
