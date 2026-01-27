<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { SendOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { addApp } from '@/api/app'

const router = useRouter()
const authStore = useAuthStore()

const promptText = ref('')
const loading = ref(false)

// 快捷标签
const quickTags = [
  '波普风电商页面',
  '企业网站',
  '电商运营后台',
  '暗黑话题社区'
]

// 发送提示词
async function handleSend() {
  if (!promptText.value.trim()) {
    message.warning('请输入您的需求描述')
    return
  }
  
  // 检查登录状态
  if (!authStore.isAuthenticated) {
    message.info('请先登录')
    router.push({
      path: '/login',
      query: { redirect: `/editor?prompt=${encodeURIComponent(promptText.value)}` }
    })
    return
  }
  
  loading.value = true
  try {
    // 创建应用
    const res = await addApp({ initPrompt: promptText.value })
    if (res.data.code === 0) {
      const appId = res.data.data
      // 跳转到编辑器
      router.push(`/editor/${appId}`)
    } else {
      message.error(res.data.message || '创建应用失败')
    }
  } catch (error) {
    message.error('创建应用失败，请重试')
  } finally {
    loading.value = false
  }
}

// 点击快捷标签
function handleTagClick(tag: string) {
  promptText.value = tag
}
</script>

<template>
  <div class="prompt-input-container">
    <div class="input-wrapper">
      <a-textarea
        v-model:value="promptText"
        :auto-size="{ minRows: 3, maxRows: 6 }"
        placeholder="使用 NoCode 创建一个高效的小工具，帮我计算......"
        class="prompt-textarea"
        @pressEnter.ctrl="handleSend"
      />
      
      <div class="input-actions">
        <div class="left-actions">
          <a-button size="small">
            <UploadOutlined />
            上传
          </a-button>
          <a-button size="small">✨ 优化</a-button>
        </div>
        <a-button
          type="primary"
          shape="circle"
          size="large"
          :loading="loading"
          @click="handleSend"
        >
          <template #icon>
            <SendOutlined />
          </template>
        </a-button>
      </div>
    </div>
    
    <!-- 快捷标签 -->
    <div class="quick-tags">
      <a-tag
        v-for="tag in quickTags"
        :key="tag"
        class="quick-tag"
        @click="handleTagClick(tag)"
      >
        {{ tag }}
      </a-tag>
    </div>
  </div>
</template>

<style scoped lang="less">
.prompt-input-container {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
}

.input-wrapper {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.prompt-textarea {
  border: none;
  resize: none;
  font-size: 16px;
  
  &:focus {
    box-shadow: none;
  }
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.left-actions {
  display: flex;
  gap: 8px;
}

.quick-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.quick-tag {
  cursor: pointer;
  border-radius: 16px;
  padding: 4px 16px;
  background: #fff;
  border: 1px solid #e8e8e8;
  transition: all 0.3s;
  
  &:hover {
    border-color: #722ED1;
    color: #722ED1;
  }
}
</style>
