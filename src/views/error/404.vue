<script setup lang="ts">
import { useRouter } from 'vue-router'

defineOptions({ name: 'NotFoundPage' })

const router = useRouter()
</script>

<template>
  <div class="error-page">
    <h1 class="error-code">404</h1>
    <p class="error-desc">抱歉，你访问的页面不存在</p>
    <el-button type="primary" @click="router.push('/')">返回首页</el-button>
  </div>
</template>

<style scoped lang="scss">
.error-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background-color: var(--el-bg-color-page);

  .error-code {
    margin: 0;
    font-size: 96px;
    font-weight: 700;
    color: var(--el-color-primary);
    text-shadow: 0 8px 24px var(--el-color-primary-light-7);
  }

  .error-desc {
    margin: 0 0 16px;
    font-size: 16px;
    color: var(--el-text-color-secondary);
  }
}
</style>
