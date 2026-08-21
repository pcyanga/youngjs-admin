<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowDown, Close } from '@element-plus/icons-vue'
import { useTagsViewStore, type TagView } from '@/store/modules/tagsView'

const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsViewStore()

const visitedViews = computed(() => tagsViewStore.visitedViews)
const isActive = (path: string) => route.path === path

/** 路由变化时记录标签 */
watch(
  () => route.path,
  () => {
    if (route.meta.title && !route.meta.hidden) {
      tagsViewStore.addView({
        path: route.path,
        fullPath: route.fullPath,
        name: (route.name as string) || '',
        title: route.meta.title,
        keepAlive: route.meta.keepAlive !== false,
        affix: route.meta.affix,
      })
    }
  },
  { immediate: true }
)

const closeTag = (view: TagView) => {
  tagsViewStore.delView(view)
  if (isActive(view.path)) {
    const latest = visitedViews.value[visitedViews.value.length - 1]
    router.push(latest ? latest.path : '/')
  }
}

const closeOthers = () => {
  const current = visitedViews.value.find((v) => v.path === route.path)
  if (current) tagsViewStore.delOthersViews(current)
}

const closeAll = () => {
  tagsViewStore.delAllViews()
  router.push('/')
}
</script>

<template>
  <div class="tags-view">
    <el-scrollbar class="tags-scrollbar">
      <div class="tags-wrapper">
        <router-link
          v-for="view in visitedViews"
          :key="view.path"
          :to="view.fullPath"
          class="tag-item"
          :class="{ active: isActive(view.path) }"
        >
          <span class="tag-dot" />
          <span>{{ view.title }}</span>
          <el-icon v-if="visitedViews.length > 1" class="tag-close" @click.prevent="closeTag(view)">
            <Close />
          </el-icon>
        </router-link>
      </div>
    </el-scrollbar>

    <el-dropdown class="tags-dropdown" trigger="click">
      <el-icon class="tags-more"><ArrowDown /></el-icon>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="closeOthers">关闭其他</el-dropdown-item>
          <el-dropdown-item @click="closeAll">关闭全部</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style scoped lang="scss">
.tags-view {
  display: flex;
  align-items: center;
  height: var(--tags-view-height);
  padding: 0 8px;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  flex-shrink: 0;

  .tags-scrollbar {
    flex: 1;
    overflow: hidden;
  }

  .tags-wrapper {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 0;
    white-space: nowrap;
  }

  .tag-item {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 26px;
    padding: 0 10px;
    font-size: 12px;
    color: var(--el-text-color-regular);
    background-color: var(--el-fill-color-light);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 4px;
    text-decoration: none;
    transition: all 0.2s;

    .tag-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: transparent;
      transition: all 0.2s;
    }

    .tag-close {
      font-size: 12px;
      cursor: pointer;
      border-radius: 50%;

      &:hover {
        color: #fff;
        background-color: var(--el-color-danger);
      }
    }

    &.active {
      color: #fff;
      background-color: var(--el-color-primary);
      border-color: var(--el-color-primary);

      .tag-dot {
        background-color: #fff;
      }
    }
  }

  .tags-dropdown {
    margin-left: 6px;

    .tags-more {
      font-size: 16px;
      cursor: pointer;
      color: var(--el-text-color-regular);
    }
  }
}
</style>
