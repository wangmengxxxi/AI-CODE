<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { getAppVoById, updateApp, adminUpdateApp } from '@/api/app'
import { useAuthStore } from '@/stores/auth'
import type { AppVO } from '@/types'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const app = ref<AppVO | null>(null)
const loading = ref(false)
const saving = ref(false)

// 表单数据
const formState = ref({
  appName: '',
  cover: '',
  priority: 0
})

const appId = Number(route.params.id)

// 加载应用
async function loadApp() {
  loading.value = true
  try {
    const res = await getAppVoById(appId)
    if (res.data.code === 0) {
      app.value = res.data.data
      formState.value = {
        appName: app.value.appName,
        cover: app.value.cover || '',
        priority: app.value.priority
      }
    } else {
      message.error(res.data.message || '加载失败')
    }
  } catch (error) {
    message.error('加载失败')
  } finally {
    loading.value = false
  }
}

// 保存
async function handleSave() {
  saving.value = true
  try {
    let res
    if (authStore.isAdmin) {
      res = await adminUpdateApp({
        id: appId,
        appName: formState.value.appName,
        cover: formState.value.cover,
        priority: formState.value.priority
      })
    } else {
      res = await updateApp({
        id: appId,
        appName: formState.value.appName
      })
    }
    
    if (res.data.code === 0) {
      message.success('保存成功')
      router.back()
    } else {
      message.error(res.data.message || '保存失败')
    }
  } catch (error) {
    message.error('保存失败')
  } finally {
    saving.value = false
  }
}

function goBack() {
  router.back()
}

onMounted(() => {
  loadApp()
})
</script>

<template>
  <div class="app-edit-page">
    <a-card title="编辑应用" :loading="loading">
      <template #extra>
        <a-button type="text" @click="goBack">
          <ArrowLeftOutlined /> 返回
        </a-button>
      </template>
      
      <a-form
        :model="formState"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        @finish="handleSave"
      >
        <a-form-item label="应用名称" name="appName">
          <a-input v-model:value="formState.appName" placeholder="请输入应用名称" />
        </a-form-item>
        
        <template v-if="authStore.isAdmin">
          <a-form-item label="封面图片" name="cover">
            <a-input v-model:value="formState.cover" placeholder="请输入封面图片URL" />
          </a-form-item>
          
          <a-form-item label="优先级" name="priority">
            <a-input-number v-model:value="formState.priority" :min="0" />
            <span class="priority-hint">
              优先级大于0的应用会显示在精选案例中
            </span>
          </a-form-item>
        </template>
        
        <a-form-item :wrapper-col="{ offset: 4 }">
          <a-space>
            <a-button type="primary" html-type="submit" :loading="saving">
              保存
            </a-button>
            <a-button @click="goBack">取消</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<style scoped lang="less">
.app-edit-page {
  max-width: 800px;
  margin: 32px auto;
  padding: 0 24px;
}

.priority-hint {
  margin-left: 12px;
  color: #999;
  font-size: 12px;
}
</style>
