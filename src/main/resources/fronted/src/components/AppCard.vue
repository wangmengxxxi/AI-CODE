<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { EyeOutlined, EditOutlined, DeleteOutlined, StarOutlined } from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { deleteApp } from '@/api/app'
import type { AppVO } from '@/types'

interface Props {
  app: AppVO
  showAdminActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAdminActions: false
})

const emit = defineEmits<{
  (e: 'refresh'): void
  (e: 'setFeatured', app: AppVO): void
}>()

const router = useRouter()
const authStore = useAuthStore()

// 格式化时间
function formatTime(time: string) {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const weeks = Math.floor(days / 7)
  
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  if (weeks < 4) return `${weeks}周前`
  return date.toLocaleDateString()
}

// 是否可以编辑（本人或管理员）
const canEdit = computed(() => {
  if (!authStore.isAuthenticated) return false
  if (authStore.isAdmin) return true
  return authStore.user?.id === props.app.userId
})

// 是否可以删除（本人或管理员）
const canDelete = computed(() => canEdit.value)

// 预览应用
function handlePreview() {
  if (props.app.deployKey) {
    window.open(`/static/${props.app.deployKey}/`, '_blank')
  } else {
    router.push(`/editor/${props.app.id}`)
  }
}

// 编辑应用
function handleEdit() {
  router.push(`/editor/${props.app.id}`)
}

// 删除应用
function handleDelete() {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除应用「${props.app.appName}」吗？此操作不可恢复。`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    async onOk() {
      try {
        const res = await deleteApp({ id: props.app.id })
        if (res.data.code === 0) {
          message.success('删除成功')
          emit('refresh')
        } else {
          message.error(res.data.message || '删除失败')
        }
      } catch (error) {
        message.error('删除失败')
      }
    }
  })
}

// 设为精选（管理员）
function handleSetFeatured() {
  emit('setFeatured', props.app)
}

// 默认封面
const defaultCover = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5Ij7ml6DlsIHpnaI8L3RleHQ+PC9zdmc+'
</script>

<template>
  <div class="app-card">
    <!-- 封面 -->
    <div class="card-cover">
      <img :src="app.cover || defaultCover" :alt="app.appName" />
      
      <!-- 悬停操作 -->
      <div class="card-actions">
        <a-space>
          <a-tooltip title="预览">
            <a-button shape="circle" size="small" @click="handlePreview">
              <template #icon><EyeOutlined /></template>
            </a-button>
          </a-tooltip>
          
          <a-tooltip v-if="canEdit" title="编辑">
            <a-button shape="circle" size="small" @click="handleEdit">
              <template #icon><EditOutlined /></template>
            </a-button>
          </a-tooltip>
          
          <a-tooltip v-if="canDelete" title="删除">
            <a-button shape="circle" size="small" danger @click="handleDelete">
              <template #icon><DeleteOutlined /></template>
            </a-button>
          </a-tooltip>
          
          <a-tooltip v-if="showAdminActions && authStore.isAdmin" title="设为精选">
            <a-button shape="circle" size="small" @click="handleSetFeatured">
              <template #icon><StarOutlined /></template>
            </a-button>
          </a-tooltip>
        </a-space>
      </div>
    </div>
    
    <!-- 信息 -->
    <div class="card-info">
      <h3 class="card-title">{{ app.appName }}</h3>
      <p class="card-time">创建于 {{ formatTime(app.createTime) }}</p>
    </div>
  </div>
</template>

<style scoped lang="less">
.app-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    
    .card-actions {
      opacity: 1;
    }
  }
}

.card-cover {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
  background: #f5f5f5;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.card-actions {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s;
}

.card-info {
  padding: 12px 16px;
}

.card-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin: 0 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-time {
  font-size: 12px;
  color: #999;
  margin: 0;
}
</style>
