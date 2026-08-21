<script setup lang="ts">
import { computed } from 'vue'
import type { MenuItem } from '@/types/api'
import { resolveMenuIcon } from '@/utils/icons'
import SidebarItem from './SidebarItem.vue'

const props = defineProps<{ item: MenuItem }>()

/** 目录节点的可显示子节点（过滤权限节点，后端 type 为 varchar） */
const visibleChildren = computed(() => (props.item.children || []).filter((c) => Number(c.type) !== 3))

/** 目录且含有子节点时渲染为子菜单 */
const isSubMenu = computed(() => Number(props.item.type) === 1 && visibleChildren.value.length > 0)
</script>

<template>
  <!-- 目录：递归渲染子菜单 -->
  <el-sub-menu v-if="isSubMenu" :index="String(item.id)">
    <template #title>
      <el-icon><component :is="resolveMenuIcon(item.icon)" /></el-icon>
      <span>{{ item.name }}</span>
    </template>
    <SidebarItem v-for="child in visibleChildren" :key="child.id" :item="child" />
  </el-sub-menu>

  <!-- 菜单（页面） -->
  <el-menu-item v-else-if="Number(item.type) === 2 && item.key" :index="item.key">
    <el-icon><component :is="resolveMenuIcon(item.icon)" /></el-icon>
    <template #title>{{ item.name }}</template>
  </el-menu-item>
</template>
