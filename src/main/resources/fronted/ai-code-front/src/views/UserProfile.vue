<template>
  <BasicLayout>
    <div class="profile-page">
      <a-card class="profile-card" :bordered="false">
        <div class="profile-header">
          <a-avatar :size="100" :src="userStore.userAvatar" class="avatar" />
          <div class="user-info">
            <h2 class="username">{{ userStore.displayName }}</h2>
            <a-tag :color="userStore.isAdmin ? 'red' : 'blue'" class="role-tag">
              {{ userStore.isAdmin ? '管理员' : '普通用户' }}
            </a-tag>
          </div>
        </div>

        <a-divider />

        <a-descriptions :column="1" bordered>
          <a-descriptions-item label="账号">
            {{ userStore.loginUser?.userAccount }}
          </a-descriptions-item>
          <a-descriptions-item label="用户 ID">
            {{ userStore.loginUser?.id }}
          </a-descriptions-item>
          <a-descriptions-item label="用户昵称">
            {{ userStore.loginUser?.userName || '未设置' }}
          </a-descriptions-item>
          <a-descriptions-item label="个人简介">
            {{ userStore.loginUser?.userProfile || '这个人很懒,什么都没写' }}
          </a-descriptions-item>
          <a-descriptions-item label="注册时间">
            {{ formatDate(userStore.loginUser?.createTime) }}
          </a-descriptions-item>
          <a-descriptions-item label="最后更新">
            {{ formatDate(userStore.loginUser?.updateTime) }}
          </a-descriptions-item>
        </a-descriptions>

        <div class="action-buttons">
          <a-button type="primary" size="large" @click="showEditModal = true">
            <template #icon>
              <EditOutlined />
            </template>
            编辑资料
          </a-button>
          <a-button danger size="large" @click="handleLogout">
            <template #icon>
              <LogoutOutlined />
            </template>
            退出登录
          </a-button>
        </div>
      </a-card>

      <!-- Edit Profile Modal -->
      <a-modal
        v-model:open="showEditModal"
        title="编辑个人资料"
        :confirm-loading="isUpdating"
        @ok="handleUpdateProfile"
      >
        <a-form :model="editForm" layout="vertical">
          <a-form-item label="用户昵称">
            <a-input v-model:value="editForm.userName" placeholder="请输入昵称" />
          </a-form-item>
          <a-form-item label="头像 URL">
            <a-input v-model:value="editForm.userAvatar" placeholder="请输入头像链接" />
          </a-form-item>
          <a-form-item label="个人简介">
            <a-textarea
              v-model:value="editForm.userProfile"
              :rows="4"
              placeholder="介绍一下自己吧"
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </BasicLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { EditOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/userStore'
import { updateUserAPI } from '@/api/user'
import type { UserUpdateRequest } from '@/types/user'
import BasicLayout from '@/layouts/BasicLayout.vue'

const router = useRouter()
const userStore = useUserStore()

const showEditModal = ref(false)
const isUpdating = ref(false)

const editForm = reactive<Partial<UserUpdateRequest>>({
  userName: '',
  userAvatar: '',
  userProfile: '',
})

const initEditForm = () => {
  if (userStore.loginUser) {
    editForm.userName = userStore.loginUser.userName || ''
    editForm.userAvatar = userStore.loginUser.userAvatar || ''
    editForm.userProfile = userStore.loginUser.userProfile || ''
  }
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}

const handleUpdateProfile = async () => {
  if (!userStore.loginUser?.id) return

  try {
    isUpdating.value = true
    const params: UserUpdateRequest = {
      id: userStore.loginUser.id,
      ...editForm,
    }

    const res = await updateUserAPI(params)
    if (res.code === 0) {
      message.success('更新成功')
      userStore.updateLocalUser(editForm)
      showEditModal.value = false
    }
  } catch (error) {
    console.error('更新失败:', error)
  } finally {
    isUpdating.value = false
  }
}

const handleLogout = async () => {
  await userStore.logout()
  router.push('/login')
}

onMounted(() => {
  initEditForm()
})
</script>

<style scoped lang="scss">
.profile-page {
  display: flex;
  justify-content: center;
  padding: 48px 24px;
}

.profile-card {
  width: 100%;
  max-width: 800px;
  background: rgba(30, 41, 59, 0.9);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);

  :deep(.ant-card-body) {
    padding: 40px;
  }
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
}

.avatar {
  border: 4px solid rgba(22, 119, 255, 0.3);
  box-shadow: 0 8px 24px rgba(22, 119, 255, 0.2);
}

.user-info {
  flex: 1;
}

.username {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px 0;
}

.role-tag {
  font-size: 14px;
  padding: 4px 12px;
}

:deep(.ant-descriptions) {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);

  .ant-descriptions-item-label {
    background: rgba(30, 41, 59, 0.8);
    color: rgba(255, 255, 255, 0.7);
    font-weight: 500;
  }

  .ant-descriptions-item-content {
    background: rgba(15, 23, 42, 0.6);
    color: #fff;
  }
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: 32px;

  .ant-btn {
    flex: 1;
  }
}
</style>
