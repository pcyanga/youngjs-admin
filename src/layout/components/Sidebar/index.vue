<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'

const appStore = useAppStore()
const permissionStore = usePermissionStore()
const route = useRoute()

const isCollapse = computed(() => appStore.sidebarCollapsed)
const menus = computed(() => permissionStore.menus)
/** 当前激活菜单（扁平路由，直接用 path 匹配） */
const activeMenu = computed(() => route.path)
</script>

<template>
  <aside class="sidebar-container" :class="{ collapsed: isCollapse }">
    <Logo :collapse="isCollapse" />
    <el-scrollbar class="sidebar-scrollbar">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :collapse-transition="false"
        unique-opened
        router
        class="sidebar-menu"
      >
        <SidebarItem v-for="item in menus" :key="item.id" :item="item" />
      </el-menu>
    </el-scrollbar>
  </aside>
</template>

<style scoped lang="scss">
.sidebar-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  width: var(--sidebar-width);
  background-color: var(--sidebar-bg-color);
  overflow: hidden;
  transition: width 0.28s;

  &.collapsed {
    width: var(--sidebar-collapsed-width);
  }

  .sidebar-scrollbar {
    height: calc(100% - var(--navbar-height));

    :deep(.el-scrollbar__view) {
      height: 100%;
    }
  }

  /* el-menu 深色侧边栏定制 */
  .sidebar-menu {
    border-right: none;
    --el-menu-bg-color: var(--sidebar-bg-color);
    --el-menu-text-color: var(--sidebar-text-color);
    --el-menu-hover-bg-color: var(--sidebar-hover-bg-color);
    --el-menu-active-color: #fff;
    --el-menu-item-height: 46px;
    --el-menu-sub-item-height: 42px;

    :deep(.el-menu-item.is-active) {
      background-color: var(--sidebar-active-bg-color);
    }

    :deep(.el-sub-menu .el-menu) {
      background-color: var(--sidebar-sub-bg-color);
    }
  }
}
</style>
