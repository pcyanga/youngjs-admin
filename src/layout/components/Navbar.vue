<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { Expand, Fold, FullScreen, Moon, Sunny, SwitchButton, User } from '@element-plus/icons-vue'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import Breadcrumb from './Breadcrumb/index.vue'

const appStore = useAppStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const isCollapsed = computed(() => appStore.sidebarCollapsed)
const isDark = computed(() => appStore.isDark)
const nickname = computed(() => userStore.nickname)

const toggleSidebar = () => appStore.toggleSidebar()
const toggleTheme = () => appStore.toggleTheme()

const toggleFullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen()
  }
}

const handleCommand = (command: string) => {
  if (command === 'profile') {
    router.push('/user')
  } else if (command === 'logout') {
    handleLogout()
  }
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '退出',
      cancelButtonText: '取消',
      type: 'warning',
    })
    userStore.logout()
    router.replace('/login')
  } catch {
    // 取消退出
  }
}
</script>

<template>
  <header class="navbar">
    <div class="navbar-left">
      <el-icon class="collapse-btn" @click="toggleSidebar">
        <Fold v-if="isCollapsed" />
        <Expand v-else />
      </el-icon>
      <Breadcrumb class="navbar-breadcrumb" />
    </div>

    <div class="navbar-right">
      <el-tooltip :content="isDark ? '切换到亮色模式' : '切换到暗色模式'">
        <el-icon class="navbar-action" @click="toggleTheme">
          <Moon v-if="isDark" />
          <Sunny v-else />
        </el-icon>
      </el-tooltip>

      <el-tooltip content="全屏">
        <el-icon class="navbar-action" @click="toggleFullscreen">
          <FullScreen />
        </el-icon>
      </el-tooltip>

      <el-dropdown trigger="click" @command="handleCommand">
        <div class="navbar-user">
          <el-avatar :size="30" class="navbar-avatar">{{ nickname.charAt(0).toUpperCase() }}</el-avatar>
          <span class="navbar-username">{{ nickname }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>个人中心
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style scoped lang="scss">
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--navbar-height);
  padding: 0 16px;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.06);
  flex-shrink: 0;
  z-index: 1000;

  &-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .collapse-btn {
    font-size: 20px;
    cursor: pointer;
    color: var(--el-text-color-regular);
    transition: color 0.2s;

    &:hover {
      color: var(--el-color-primary);
    }
  }

  &-right {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .navbar-action {
    padding: 8px;
    font-size: 18px;
    cursor: pointer;
    color: var(--el-text-color-regular);
    border-radius: 6px;
    transition: all 0.2s;

    &:hover {
      color: var(--el-color-primary);
      background-color: var(--el-fill-color-light);
    }
  }

  .navbar-user {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    margin-left: 6px;
    cursor: pointer;
    border-radius: 6px;
    transition: background-color 0.2s;
    outline: none;

    &:hover {
      background-color: var(--el-fill-color-light);
    }

    .navbar-avatar {
      background-color: var(--el-color-primary);
      color: #fff;
      font-size: 14px;
    }

    .navbar-username {
      font-size: 14px;
      color: var(--el-text-color-primary);
    }
  }
}
</style>
