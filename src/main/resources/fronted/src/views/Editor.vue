<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import {
  SendOutlined,
  CloseOutlined,
  RocketOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  CaretUpOutlined,
  HolderOutlined
} from '@ant-design/icons-vue'
import { useSSE } from '@/composables/useSSE'
import { getAppVoById, deployApp, updateApp } from '@/api/app'
import { listAppChatHistory } from '@/api/chatHistory'
import { extractHtmlCode } from '@/utils/htmlExtractor'
import { useAuthStore } from '@/stores/auth'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import type { AppVO, ChatMessage, ChatHistory } from '@/types'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { isLoading: sseLoading, connect, abort } = useSSE()

// 应用信息
const app = ref<AppVO | null>(null)
const appLoading = ref(false)

// 聊天消息
const messages = ref<ChatMessage[]>([])
const inputMessage = ref('')

// 生成的代码
const generatedCode = ref('')
// 保存之前的有效代码，用于 AI 回复无效时恢复
let previousValidCode = ''

// 部署状态
const deploying = ref(false)

// 历史消息加载状态
const historyLoading = ref(false)
const hasMoreHistory = ref(true)
const lastCreateTime = ref<string | undefined>(undefined)

// 预览模式：'code' 代码预览，'website' 网站预览
// 默认显示代码预览，部署后切换到网站预览
const previewMode = ref<'code' | 'website'>('code')

// 思考中状态（AI 短时间内没有输出）
const isThinking = ref(false)
let thinkTimer: ReturnType<typeof setTimeout> | null = null

// 错误状态
const hasError = ref(false)
const errorMessage = ref('')
const lastMessage = ref('') // 最后发送的消息，用于重试

// 拖拽调整宽度
const chatPanelWidth = ref(400)
const isDragging = ref(false)
const editorContentRef = ref<HTMLElement | null>(null)

// 消息列表 DOM 引用
const messageListRef = ref<HTMLElement | null>(null)

// 应用 ID
const appId = computed(() => Number(route.params.id))

// 当前用户是否应用创建者
const isAppCreator = computed(() => {
  return app.value && authStore.user && app.value.userId === authStore.user.id
})

// 预览 URL
const previewUrl = computed(() => {
  if (app.value?.deployKey) {
    return `http://localhost:8080/static/${app.value.deployKey}/`
  }
  return ''
})

// 计算可预览的 HTML 代码
const previewHtml = computed(() => {
  const result = extractHtmlCode(generatedCode.value)
  console.log('previewHtml computed:', {
    generatedCodeLength: generatedCode.value.length,
    previewHtmlLength: result.length,
    first200Chars: result.substring(0, 200)
  })
  return result
})

// 加载应用信息
async function loadApp() {
  appLoading.value = true
  try {
    const res = await getAppVoById(appId.value)
    if (res.data.code === 0) {
      app.value = res.data.data

      // 如果有至少2条对话记录，显示网站
      updatePreview()
    } else {
      message.error(res.data.message || '加载应用失败')
    }
  } catch (error) {
    message.error('加载应用失败')
  } finally {
    appLoading.value = false
  }
}

// 加载历史消息
async function loadHistoryMessages(isLoadMore = false) {
  if (historyLoading.value) return

  historyLoading.value = true
  try {
    const res = await listAppChatHistory(appId.value, 10, isLoadMore ? lastCreateTime.value : undefined)
    if (res.data.code === 0) {
      const records = res.data.data.records as ChatHistory[]

      if (records.length > 0) {
        // 转换历史消息为 ChatMessage 格式
        const historyMessages: ChatMessage[] = records.map((chat: ChatHistory) => ({
          role: chat.messageType === 'user' ? 'user' : 'assistant',
          content: chat.message,
          timestamp: new Date(chat.createTime).getTime()
        }))

        if (isLoadMore) {
          // 加载更多：反转后插入到列表开头（因为后端返回的是降序）
          const reversedHistory = [...historyMessages].reverse()
          messages.value = [...reversedHistory, ...messages.value]
        } else {
          // 首次加载：反转顺序（后端返回的是降序：最新->最老，我们需要升序：老->新）
          messages.value = [...historyMessages].reverse()

          // 加载完成后，提取最后一条 AI 消息的代码到预览区
          loadLastGeneratedCode()
          // 更新预览区
          nextTick(() => {
            updatePreview()
          })
        }

        // 更新游标 - 降序查询时，第一条是最新，最后一条是最老
        const oldestRecord = records[records.length - 1]
        lastCreateTime.value = oldestRecord.createTime

        // 判断是否还有更多
        hasMoreHistory.value = records.length >= 10
      } else {
        if (!isLoadMore) {
          messages.value = []
        }
        hasMoreHistory.value = false
      }
    }
  } catch (error) {
    console.error('加载历史消息失败', error)
    if (!isLoadMore) {
      messages.value = []
    }
  } finally {
    historyLoading.value = false
  }
}

// 加载最近一次生成的代码到预览区
function loadLastGeneratedCode() {
  console.log('loadLastGeneratedCode called, messages count:', messages.value.length)

  // 从最新消息往回查找，找到最近的一个能提取出完整HTML代码的消息
  // 完整页面代码应该至少有一定的内容长度
  for (let i = messages.value.length - 1; i >= 0; i--) {
    const msg = messages.value[i]
    if (msg.role === 'assistant' && msg.content) {
      // 尝试提取 HTML
      const htmlCode = extractHtmlCode(msg.content)
      console.log(`Message ${i} extract result:`, htmlCode ? `has HTML (${htmlCode.length})` : 'empty')
      // 要求 HTML 至少有 500 字符才算完整页面
      if (htmlCode && htmlCode.length > 500) {
        console.log('Found valid code in message', i, 'html length:', htmlCode.length)
        generatedCode.value = msg.content
        // 立即更新预览
        nextTick(() => {
          const iframe = document.querySelector('.preview-iframe') as HTMLIFrameElement
          if (iframe) {
            iframe.srcdoc = htmlCode
          }
        })
        return
      }
    }
  }

  console.log('No valid HTML code found in any message')
}

// 加载更多历史消息
async function handleLoadMore() {
  await loadHistoryMessages(true)
}

// 发送消息
async function handleSend() {
  const text = inputMessage.value.trim()
  if (!text) return

  await sendMessage(text)
}

// 重试发送消息
async function handleRetry() {
  if (lastMessage.value) {
    await sendMessage(lastMessage.value)
  }
}

// 中断当前的 AI 生成
function handleAbort() {
  abort()
}

// 发送消息的核心逻辑
async function sendMessage(text: string) {
  // 记录最后发送的消息用于重试
  lastMessage.value = text
  hasError.value = false
  errorMessage.value = ''

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: text,
    timestamp: Date.now()
  })

  inputMessage.value = ''
  // 保存之前的有效代码
  if (generatedCode.value && extractHtmlCode(generatedCode.value).length > 100) {
    previousValidCode = generatedCode.value
  }

  // 添加 AI 消息占位
  const aiMessageIndex = messages.value.length
  messages.value.push({
    role: 'assistant',
    content: '',
    timestamp: Date.now()
  })

  // 清除之前的思考计时器
  if (thinkTimer) {
    clearTimeout(thinkTimer)
  }

  // 设置思考状态 - 1秒后如果还没有内容则显示思考中
  isThinking.value = true
  thinkTimer = setTimeout(() => {
    // 检查是否已经有内容了
    if (!messages.value[aiMessageIndex]?.content && !hasError.value) {
      isThinking.value = true
    }
  }, 1000)

  // 调用 SSE 接口
  try {
    await connect(
      appId.value,
      text,
      (chunk) => {
        // 停止思考状态
        isThinking.value = false
        if (thinkTimer) {
          clearTimeout(thinkTimer)
          thinkTimer = null
        }
        // 追加内容
        messages.value[aiMessageIndex].content += chunk
        generatedCode.value += chunk
      },
      () => {
        // 完成
        isThinking.value = false
        if (thinkTimer) {
          clearTimeout(thinkTimer)
          thinkTimer = null
        }
        // 检查新生成的内容是否有有效的 HTML 代码
        const newHtml = extractHtmlCode(generatedCode.value)
        console.log('AI response extract result:', newHtml ? `has HTML (${newHtml.length})` : 'empty')
        if (newHtml && newHtml.length >= 500) {
          // 生成了有效代码，更新保存的代码
          console.log('Valid new code generated, updating preview')
          previousValidCode = generatedCode.value
        } else {
          // 没有生成有效代码，恢复之前的预览
          console.log('No valid new code generated, restoring previous preview')
          if (previousValidCode) {
            generatedCode.value = previousValidCode
          }
        }
        updatePreview()
      },
      (err) => {
        isThinking.value = false
        if (thinkTimer) {
          clearTimeout(thinkTimer)
          thinkTimer = null
        }
        // 简化错误消息，只显示主要错误信息
        let errorMsg = err.message || '网络错误，请重试'
        // 如果错误消息太长或包含特殊字符，只显示关键部分
        if (errorMsg.includes('Connection reset')) {
          errorMsg = '网络连接被重置，请重试'
        } else if (errorMsg.includes('Failed to fetch') || errorMsg.includes('fetch')) {
          errorMsg = '网络请求失败，请检查网络后重试'
        } else if (errorMsg.length > 50) {
          errorMsg = '请求失败，请重试'
        }
        // 设置错误状态
        hasError.value = true
        errorMessage.value = errorMsg
        // AI 消息不显示错误，保持空白让用户知道生成失败
        messages.value[aiMessageIndex].content = ''
      }
    )
  } catch (error) {
    isThinking.value = false
    hasError.value = true
    let errorMsg = error instanceof Error ? error.message : '未知错误'
    // 简化错误消息
    if (errorMsg.length > 50) {
      errorMsg = '请求失败，请重试'
    }
    errorMessage.value = errorMsg
    if (thinkTimer) {
      clearTimeout(thinkTimer)
      thinkTimer = null
    }
  }
}

// 自动发送初始消息
function autoSendInitPrompt() {
  // 只有是自己的应用且没有对话历史时才自动发送
  if (app.value?.initPrompt && messages.value.length === 0 && isAppCreator.value) {
    inputMessage.value = app.value.initPrompt
    handleSend()
  }
}

// 更新预览
function updatePreview() {
  const iframe = document.querySelector('.preview-iframe') as HTMLIFrameElement
  if (iframe) {
    if (showWebsite.value) {
      // 显示网站
      iframe.removeAttribute('srcdoc')
    } else if (generatedCode.value) {
      // 显示生成的代码预览
      iframe.srcdoc = extractHtmlCode(generatedCode.value)
    }
  }
}

// 是否显示网站（需要同时满足：有部署key、预览模式为website）
const showWebsite = computed(() => {
  const result = previewMode.value === 'website' && messages.value.length >= 2 && !!app.value?.deployKey
  console.log('showWebsite computed:', {
    previewMode: previewMode.value,
    messagesLength: messages.value.length,
    hasDeployKey: !!app.value?.deployKey,
    result
  })
  return result
})

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
      // 切换到网站预览模式
      previewMode.value = 'website'
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

// 开始拖拽
function handleDragStart(e: MouseEvent) {
  isDragging.value = true
  document.addEventListener('mousemove', handleDragMove)
  document.addEventListener('mouseup', handleDragEnd)
  e.preventDefault()
}

// 拖拽中
function handleDragMove(e: MouseEvent) {
  if (!isDragging.value || !editorContentRef.value) return
  const rect = editorContentRef.value.getBoundingClientRect()
  const newWidth = e.clientX - rect.left
  // 限制最小和最大宽度
  chatPanelWidth.value = Math.max(300, Math.min(newWidth, rect.width - 300))
}

// 结束拖拽
function handleDragEnd() {
  isDragging.value = false
  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
}

onMounted(async () => {
  await loadApp()
  // 加载历史消息
  await loadHistoryMessages()
  // 自动发送初始消息
  autoSendInitPrompt()
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
    <div class="editor-content" ref="editorContentRef">
      <!-- 左侧对话区 -->
      <div class="chat-panel" :style="{ width: chatPanelWidth + 'px' }">
        <!-- 消息列表 -->
        <div class="message-list" ref="messageListRef">
          <!-- 加载更多按钮 -->
          <div v-if="hasMoreHistory" class="load-more-wrapper">
            <a-button
              type="link"
              size="small"
              :loading="historyLoading"
              @click="handleLoadMore"
            >
              <CaretUpOutlined /> 加载更多
            </a-button>
          </div>

          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="['message-item', msg.role]"
          >
            <div class="message-content">
              <template v-if="msg.role === 'assistant'">
                <div class="ai-badge">AI 回复</div>
              </template>
              <!-- 用户消息显示纯文本，AI 消息使用 Markdown 渲染 -->
              <div v-if="msg.role === 'user'" class="message-text">{{ msg.content }}</div>
              <MarkdownRenderer v-else :content="msg.content" />
            </div>
          </div>

          <!-- 思考中动画（AI 短时间内没有输出时） -->
          <div v-if="isThinking && !messages[messages.length - 1]?.content" class="thinking-indicator">
            <div class="thinking-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>AI 正在思考...</span>
          </div>

          <!-- 加载中动画（AI 正在输出内容时） -->
          <div v-else-if="sseLoading || (messages[messages.length - 1]?.content && sseLoading)" class="loading-indicator">
            <a-spin size="small" />
            <span>AI 正在生成代码...</span>
          </div>

          <!-- 错误状态显示 -->
          <div v-else-if="hasError" class="error-indicator">
            <span class="error-text">{{ errorMessage }}</span>
            <a-button type="primary" size="small" @click="handleRetry">
              重试
            </a-button>
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
              v-if="!sseLoading"
              type="primary"
              shape="circle"
              :disabled="!inputMessage.trim()"
              @click="handleSend"
            >
              <template #icon><SendOutlined /></template>
            </a-button>
            <!-- 中断按钮 -->
            <a-button
              v-else
              type="primary"
              danger
              shape="circle"
              @click="handleAbort"
            >
              <template #icon><CloseOutlined /></template>
            </a-button>
          </div>
        </div>
      </div>

      <!-- 拖拽条 -->
      <div
        class="resize-handle"
        :class="{ dragging: isDragging }"
        @mousedown="handleDragStart"
      >
        <HolderOutlined />
      </div>

      <!-- 右侧预览区 -->
      <div class="preview-panel">
        <div class="preview-header">
          <span>生成后的网页展示</span>
          <a-tag v-if="showWebsite" color="purple">网站预览</a-tag>
          <a-tag v-else-if="sseLoading" color="processing">实时生成中...</a-tag>
          <a-tag v-else-if="previewHtml" color="success">预览就绪</a-tag>
        </div>
        <div class="preview-content">
          <!-- 已部署的应用使用 src（有至少2条对话记录时显示） -->
          <iframe
            v-if="showWebsite && previewUrl"
            class="preview-iframe"
            :src="previewUrl"
            sandbox="allow-scripts allow-same-origin"
          />
          <!-- 生成的代码使用 srcdoc -->
          <iframe
            v-else-if="previewHtml && !showWebsite"
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
  min-width: 300px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  flex-shrink: 0;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

// 拖拽条
.resize-handle {
  width: 6px;
  background: #f0f0f0;
  cursor: col-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  flex-shrink: 0;

  &:hover,
  &.dragging {
    background: #722ED1;
    color: #fff;
  }
}

.load-more-wrapper {
  text-align: center;
  padding: 8px 0;
  margin-bottom: 16px;
  border-bottom: 1px dashed #e8e8e8;
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

// 思考中动画
.thinking-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #722ED1;
  font-size: 14px;
  padding: 8px 12px;

  .thinking-dots {
    display: flex;
    gap: 4px;

    span {
      width: 8px;
      height: 8px;
      background: #722ED1;
      border-radius: 50%;
      animation: bounce 1.4s infinite ease-in-out both;

      &:nth-child(1) {
        animation-delay: -0.32s;
      }

      &:nth-child(2) {
        animation-delay: -0.16s;
      }
    }
  }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

// 错误状态显示
.error-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 8px;
  margin-top: 8px;

  .error-text {
    color: #ff4d4f;
    font-size: 14px;
  }
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
