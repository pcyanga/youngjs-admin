<script setup lang="ts">
defineProps<{ collapse: boolean }>()
</script>

<template>
  <div class="sidebar-logo" :class="{ collapsed: collapse }">
    <img src="@/assets/logo.svg" alt="Youngjs" class="logo-img" />
    <span v-show="!collapse" class="logo-title">Youngjs Admin</span>
  </div>
</template>

<style scoped lang="scss">
.sidebar-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: var(--navbar-height);
  overflow: hidden;
  background-color: var(--sidebar-bg-color);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  .logo-img {
    width: 30px;
    height: 30px;
    flex-shrink: 0;
  }

  .logo-title {
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    white-space: nowrap;
  }

  &.collapsed {
    .logo-title {
      display: none;
    }
  }
}
</style>
