<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import Sidebar from './components/Sidebar/index.vue'
import Navbar from './components/Navbar.vue'
import TagsView from './components/TagsView/index.vue'
import AppMain from './components/AppMain.vue'

const appStore = useAppStore()
const isCollapsed = computed(() => appStore.sidebarCollapsed)
</script>

<template>
  <div class="app-wrapper" :class="{ 'is-collapsed': isCollapsed }">
    <Sidebar />
    <div class="main-container">
      <Navbar />
      <TagsView />
      <AppMain />
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .main-container {
    height: 100%;
    margin-left: var(--sidebar-width);
    transition: margin-left 0.28s;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: var(--el-bg-color-page);
  }

  &.is-collapsed {
    .main-container {
      margin-left: var(--sidebar-collapsed-width);
    }
  }
}
</style>
