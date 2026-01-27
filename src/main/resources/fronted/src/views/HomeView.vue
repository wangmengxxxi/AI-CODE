<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import PromptInput from '@/components/PromptInput.vue'
import AppCard from '@/components/AppCard.vue'
import { useAuthStore } from '@/stores/auth'
import { listMyAppByPage, listGoodAppByPage } from '@/api/app'
import type { AppVO, PageResponse } from '@/types'

const authStore = useAuthStore()

// 我的作品
const myApps = ref<AppVO[]>([])
const myAppsLoading = ref(false)
const myAppsPagination = ref({
  current: 1,
  pageSize: 6,
  total: 0
})

// 精选案例
const goodApps = ref<AppVO[]>([])
const goodAppsLoading = ref(false)
const goodAppsPagination = ref({
  current: 1,
  pageSize: 6,
  total: 0
})

// 是否显示我的作品
const showMyApps = computed(() => authStore.isAuthenticated)

// 加载我的作品
async function loadMyApps() {
  if (!authStore.isAuthenticated) return
  
  myAppsLoading.value = true
  try {
    const res = await listMyAppByPage({
      pageNum: myAppsPagination.value.current,
      pageSize: myAppsPagination.value.pageSize
    })
    if (res.data.code === 0) {
      const data = res.data.data as PageResponse<AppVO>
      myApps.value = data.records
      myAppsPagination.value.total = data.totalRow
    }
  } catch (error) {
    console.error('加载我的作品失败', error)
  } finally {
    myAppsLoading.value = false
  }
}

// 加载精选案例
async function loadGoodApps() {
  goodAppsLoading.value = true
  try {
    const res = await listGoodAppByPage({
      pageNum: goodAppsPagination.value.current,
      pageSize: goodAppsPagination.value.pageSize
    })
    if (res.data.code === 0) {
      const data = res.data.data as PageResponse<AppVO>
      goodApps.value = data.records
      goodAppsPagination.value.total = data.totalRow
    }
  } catch (error) {
    console.error('加载精选案例失败', error)
  } finally {
    goodAppsLoading.value = false
  }
}

// 刷新我的作品
function refreshMyApps() {
  loadMyApps()
}

// 分页变化
function handleMyAppsPageChange(page: number) {
  myAppsPagination.value.current = page
  loadMyApps()
}

function handleGoodAppsPageChange(page: number) {
  goodAppsPagination.value.current = page
  loadGoodApps()
}

onMounted(() => {
  loadMyApps()
  loadGoodApps()
})
</script>

<template>
  <div class="home-page">
    <!-- Hero 区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          一句话
          <span class="hero-icon">🤖</span>
          呈所想
        </h1>
        <p class="hero-subtitle">与 AI 对话轻松创建应用和网站</p>
        
        <!-- 输入框 -->
        <div class="prompt-area">
          <PromptInput />
        </div>
      </div>
    </section>

    <!-- 我的作品 -->
    <section v-if="showMyApps" class="apps-section">
      <div class="section-container">
        <h2 class="section-title">我的作品</h2>
        
        <a-spin :spinning="myAppsLoading">
          <a-empty v-if="myApps.length === 0 && !myAppsLoading" description="暂无作品" />
          
          <div v-else class="apps-grid">
            <AppCard
              v-for="app in myApps"
              :key="app.id"
              :app="app"
              @refresh="refreshMyApps"
            />
          </div>
          
          <div v-if="myAppsPagination.total > myAppsPagination.pageSize" class="pagination-area">
            <a-pagination
              v-model:current="myAppsPagination.current"
              :total="myAppsPagination.total"
              :page-size="myAppsPagination.pageSize"
              size="small"
              @change="handleMyAppsPageChange"
            />
          </div>
        </a-spin>
      </div>
    </section>

    <!-- 精选案例 -->
    <section class="apps-section featured-section">
      <div class="section-container">
        <h2 class="section-title">精选案例</h2>
        
        <a-spin :spinning="goodAppsLoading">
          <a-empty v-if="goodApps.length === 0 && !goodAppsLoading" description="暂无精选案例" />
          
          <div v-else class="apps-grid">
            <AppCard
              v-for="app in goodApps"
              :key="app.id"
              :app="app"
            />
          </div>
          
          <div v-if="goodAppsPagination.total > goodAppsPagination.pageSize" class="pagination-area">
            <a-pagination
              v-model:current="goodAppsPagination.current"
              :total="goodAppsPagination.total"
              :page-size="goodAppsPagination.pageSize"
              size="small"
              @change="handleGoodAppsPageChange"
            />
          </div>
        </a-spin>
      </div>
    </section>
  </div>
</template>

<style scoped lang="less">
.home-page {
  min-height: 100%;
}

.hero-section {
  background: linear-gradient(135deg, #e0f7fa 0%, #e8f5e9 50%, #f3e5f5 100%);
  padding: 80px 24px 60px;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  
  .hero-icon {
    font-size: 56px;
  }
}

.hero-subtitle {
  font-size: 18px;
  color: #666;
  margin-bottom: 40px;
}

.prompt-area {
  max-width: 700px;
  margin: 0 auto;
}

.apps-section {
  padding: 48px 24px;
  
  &.featured-section {
    background: #fafafa;
  }
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
}

.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.pagination-area {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
    flex-direction: column;
    gap: 8px;
    
    .hero-icon {
      font-size: 40px;
    }
  }
  
  .hero-subtitle {
    font-size: 16px;
  }
  
  .apps-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}
</style>
