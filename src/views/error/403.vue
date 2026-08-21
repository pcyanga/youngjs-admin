<script setup lang="ts">
import { useRouter } from 'vue-router'

defineOptions({ name: 'ForbiddenPage' })

const router = useRouter()
</script>

<template>
  <div class="error-page">
    <h1 class="error-code">403</h1>
    <p class="error-desc">抱歉，你没有权限访问该页面</p>
    <el-button type="primary" @click="router.back()">返回上一页</el-button>
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
    color: var(--el-color-warning);
    text-shadow: 0 8px 24px var(--el-color-warning-light-7);
  }

  .error-desc {
    margin: 0 0 16px;
    font-size: 16px;
    color: var(--el-text-color-secondary);
  }
}
</style>
