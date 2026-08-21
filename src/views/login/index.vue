<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { setupDynamicRoutes } from '@/router/dynamic'

defineOptions({ name: 'LoginPage' })

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const form = reactive({
  username: 'admin',
  password: '123456',
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const handleLogin = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      await userStore.login(form)
      const userInfo = await userStore.getUserInfo()
      setupDynamicRoutes(userInfo.menu || [])
      ElMessage.success('登录成功')
      router.replace((route.query.redirect as string) || '/')
    } catch {
      // 错误提示已由请求层统一处理
    } finally {
      loading.value = false
    }
  })
}
</script>

<template>
  <div class="login-page">
    <!-- 左侧品牌区 -->
    <div class="login-brand">
      <div class="brand-inner">
        <div class="brand-logo">
          <img src="@/assets/logo.svg" alt="Youngjs" />
        </div>
        <h1 class="brand-title">Youngjs 后台管理系统</h1>
        <p class="brand-desc">基于 Vue 3 + TypeScript + Pinia + Element Plus 构建，适配 Youngjs 后端框架</p>
      </div>
    </div>

    <!-- 右侧登录表单 -->
    <div class="login-form-panel">
      <el-card class="login-card" shadow="never">
        <h2 class="card-title">欢迎登录</h2>
        <p class="card-subtitle">请输入账号密码进入系统</p>

        <el-form ref="formRef" :model="form" :rules="rules" size="large" @keyup.enter="handleLogin">
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="用户名" :prefix-icon="User" clearable />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="密码"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="login-btn" :loading="loading" @click="handleLogin">
              登 录
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: var(--el-bg-color-page);
}

/* 左侧品牌区 */
.login-brand {
  display: none;
  flex: 1;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1f4f9c 0%, #2f6bed 45%, #409eff 100%);

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
  }

  &::before {
    width: 420px;
    height: 420px;
    top: -120px;
    right: -80px;
  }

  &::after {
    width: 320px;
    height: 320px;
    bottom: -100px;
    left: -60px;
  }

  .brand-inner {
    position: relative;
    z-index: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    padding: 24px;
  }

  .brand-logo img {
    width: 72px;
    height: 72px;
    border-radius: 16px;
  }

  .brand-title {
    margin: 24px 0 12px;
    font-size: 30px;
    font-weight: 600;
  }

  .brand-desc {
    margin: 0;
    font-size: 15px;
    opacity: 0.85;
    text-align: center;
    line-height: 1.8;
  }
}

/* 右侧表单区 */
.login-form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  border: none;
  box-shadow: 0 12px 40px rgba(0, 21, 41, 0.12);
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 40px 36px;
  }

  .card-title {
    margin: 0 0 8px;
    font-size: 22px;
    color: var(--el-text-color-primary);
  }

  .card-subtitle {
    margin: 0 0 28px;
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }

  .login-btn {
    width: 100%;
    margin-top: 4px;
  }
}

@media (min-width: 900px) {
  .login-brand {
    display: flex;
  }
}
</style>
