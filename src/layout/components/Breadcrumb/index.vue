<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePermissionStore } from '@/store/modules/permission'
import type { MenuItem } from '@/types/api'

const route = useRoute()
const permissionStore = usePermissionStore()

/** 根据菜单树查找当前路由的层级链路（用于面包屑） */
function findTrail(menus: MenuItem[], path: string, trail: MenuItem[] = []): MenuItem[] | null {
  for (const item of menus) {
    const next = [...trail, item]
    if (item.key === path) return next
    if (item.children?.length) {
      const found = findTrail(item.children, path, next)
      if (found) return found
    }
  }
  return null
}

const breadcrumbs = computed(() => {
  // 个人中心等固定路由
  if (route.path === '/user') {
    return [{ name: '个人中心' }]
  }
  const trail = findTrail(permissionStore.menus, route.path) || []
  return trail.map((item) => ({ name: item.name }))
})
</script>

<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
      {{ item.name }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
