<script setup lang="ts">
/**
 * 空白布局
 * 用于登录、注册等不需要导航的页面
 */
</script>

<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#722ED1',
        borderRadius: 8
      }
    }"
  >
    <div class="blank-layout">
      <router-view />
    </div>
  </a-config-provider>
</template>

<style scoped lang="less">
.blank-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f7fa 0%, #e8f5e9 50%, #f3e5f5 100%);
}
</style>
