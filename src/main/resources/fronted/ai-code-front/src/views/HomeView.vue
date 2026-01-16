<template>
  <BasicLayout>
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="gradient-text">AI 驱动的</span>
            <br />
            智能代码生成平台
          </h1>
          <p class="hero-description">
            结合 RAG 知识库,让 AI 更懂你的代码风格。<br />
            从需求到实现,一键生成高质量代码。
          </p>
          <div class="hero-actions">
            <a-button type="primary" size="large" @click="router.push('/workspace')">
              <template #icon><ThunderboltOutlined /></template>
              开始使用
            </a-button>
            <a-button size="large" ghost @click="router.push('/knowledge')">
              <template #icon><BookOutlined /></template>
              浏览知识库
            </a-button>
          </div>
        </div>
        <div class="hero-decoration">
          <div class="code-preview">
            <div class="code-header">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <pre class="code-content"><code><span class="keyword">async function</span> <span class="function">generateCode</span>(prompt) {
  <span class="keyword">const</span> context = <span class="keyword">await</span> rag.search(prompt);
  <span class="keyword">const</span> code = <span class="keyword">await</span> ai.generate({
    prompt,
    context,
    style: <span class="string">'typescript'</span>
  });
  <span class="keyword">return</span> code;
}</code></pre>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <h2 class="section-title">核心功能</h2>
        <a-row :gutter="[24, 24]">
          <a-col :xs="24" :sm="12" :lg="8">
            <div class="feature-card">
              <div class="feature-icon">
                <RobotOutlined />
              </div>
              <h3 class="feature-title">智能代码生成</h3>
              <p class="feature-desc">
                基于大语言模型,理解自然语言需求, 自动生成符合规范的代码。
              </p>
            </div>
          </a-col>
          <a-col :xs="24" :sm="12" :lg="8">
            <div class="feature-card">
              <div class="feature-icon purple">
                <DatabaseOutlined />
              </div>
              <h3 class="feature-title">RAG 知识库</h3>
              <p class="feature-desc">
                上传项目文档和代码规范, AI 会学习你的风格并应用到生成中。
              </p>
            </div>
          </a-col>
          <a-col :xs="24" :sm="12" :lg="8">
            <div class="feature-card">
              <div class="feature-icon green">
                <CodeOutlined />
              </div>
              <h3 class="feature-title">实时预览</h3>
              <p class="feature-desc">
                代码即时渲染预览, 所见即所得,快速迭代调整。
              </p>
            </div>
          </a-col>
        </a-row>
      </section>

      <!-- Stats Section -->
      <section class="stats-section">
        <a-row :gutter="[48, 24]">
          <a-col :xs="12" :sm="6">
            <div class="stat-item">
              <div class="stat-value">10K+</div>
              <div class="stat-label">代码生成次数</div>
            </div>
          </a-col>
          <a-col :xs="12" :sm="6">
            <div class="stat-item">
              <div class="stat-value">500+</div>
              <div class="stat-label">活跃用户</div>
            </div>
          </a-col>
          <a-col :xs="12" :sm="6">
            <div class="stat-item">
              <div class="stat-value">95%</div>
              <div class="stat-label">代码准确率</div>
            </div>
          </a-col>
          <a-col :xs="12" :sm="6">
            <div class="stat-item">
              <div class="stat-value">24/7</div>
              <div class="stat-label">持续服务</div>
            </div>
          </a-col>
        </a-row>
      </section>
    </div>
  </BasicLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  ThunderboltOutlined,
  BookOutlined,
  RobotOutlined,
  DatabaseOutlined,
  CodeOutlined,
} from '@ant-design/icons-vue'
import BasicLayout from '@/layouts/BasicLayout.vue'

const router = useRouter()
</script>

<style scoped lang="scss">
.home-page {
  padding: 0;
}

// Hero Section
.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;
  padding: 80px 48px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
    padding: 48px 24px;
  }
}

.hero-content {
  flex: 1;
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
  margin: 0 0 24px 0;

  @media (max-width: 768px) {
    font-size: 36px;
  }
}

.gradient-text {
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
  margin: 0 0 32px 0;
}

.hero-actions {
  display: flex;
  gap: 16px;

  @media (max-width: 1024px) {
    justify-content: center;
  }

  .ant-btn-primary {
    height: 48px;
    padding: 0 32px;
    font-size: 16px;
    font-weight: 600;
    background: linear-gradient(135deg, #1677ff 0%, #5b8def 100%);
    border: none;
  }

  .ant-btn[ghost] {
    height: 48px;
    padding: 0 32px;
    font-size: 16px;
    color: #fff;
    border-color: rgba(255, 255, 255, 0.3);

    &:hover {
      border-color: #1677ff;
      color: #1677ff;
    }
  }
}

.hero-decoration {
  flex-shrink: 0;

  @media (max-width: 1024px) {
    width: 100%;
  }
}

.code-preview {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.code-header {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(15, 23, 42, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;

  &.red {
    background: #ff5f56;
  }
  &.yellow {
    background: #ffbd2e;
  }
  &.green {
    background: #27c93f;
  }
}

.code-content {
  padding: 20px;
  margin: 0;
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #e2e8f0;
  overflow-x: auto;

  .keyword {
    color: #c792ea;
  }
  .function {
    color: #82aaff;
  }
  .string {
    color: #c3e88d;
  }
}

// Features Section
.features-section {
  padding: 80px 48px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 48px 24px;
  }
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  margin: 0 0 48px 0;
}

.feature-card {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px;
  height: 100%;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-8px);
    border-color: rgba(22, 119, 255, 0.3);
    box-shadow: 0 12px 32px rgba(22, 119, 255, 0.15);
  }
}

.feature-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(22, 119, 255, 0.2) 0%, rgba(22, 119, 255, 0.1) 100%);
  border-radius: 12px;
  font-size: 24px;
  color: #1677ff;
  margin-bottom: 20px;

  &.purple {
    background: linear-gradient(135deg, rgba(167, 139, 250, 0.2) 0%, rgba(167, 139, 250, 0.1) 100%);
    color: #a78bfa;
  }

  &.green {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%);
    color: #22c55e;
  }
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 12px 0;
}

.feature-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin: 0;
}

// Stats Section
.stats-section {
  padding: 60px 48px;
  max-width: 1400px;
  margin: 0 auto;
  background: rgba(22, 119, 255, 0.05);
  border-radius: 24px;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    padding: 48px 24px;
    margin: 0 24px 48px;
  }
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 32px;
  }
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}
</style>
