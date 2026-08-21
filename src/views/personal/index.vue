<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { updateUser } from '@/api/user'

defineOptions({ name: 'PersonalCenter' })

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

const formRef = ref<FormInstance>()
const saving = ref(false)
const form = reactive({
  nickname: '',
  password: '',
})

const rules: FormRules = {
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
}

const handleSave = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    saving.value = true
    try {
      await updateUser({
        id: userInfo.value?.id,
        nickname: form.nickname,
        ...(form.password ? { password: form.password } : {}),
      })
      // 刷新用户信息
      await userStore.getUserInfo()
      form.password = ''
      ElMessage.success('保存成功')
    } finally {
      saving.value = false
    }
  })
}
</script>

<template>
  <div class="personal-page">
    <!-- 个人信息卡片 -->
    <el-card shadow="never" class="info-card">
      <div class="info-body">
        <el-avatar :size="80" class="info-avatar">{{ (userInfo?.nickname || userInfo?.username || 'U').charAt(0).toUpperCase() }}</el-avatar>
        <div class="info-text">
          <h2 class="info-name">{{ userInfo?.nickname || userInfo?.username }}</h2>
          <p class="info-meta">
            用户名：{{ userInfo?.username }}
            <el-divider direction="vertical" />
            IP：{{ userInfo?.ip || '-' }}
            <el-divider direction="vertical" />
            归属地：{{ userInfo?.ipAddr || '-' }}
          </p>
          <p class="info-meta">ID：{{ userInfo?.id }}</p>
        </div>
      </div>
    </el-card>

    <!-- 修改资料卡片 -->
    <el-card shadow="never" header="修改资料">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px" class="profile-form">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            placeholder="留空则不修改"
            autocomplete="new-password"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="saving" @click="handleSave">保存修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.personal-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 720px;

  .info-body {
    display: flex;
    align-items: center;
    gap: 24px;

    .info-avatar {
      font-size: 28px;
      background-color: var(--el-color-primary);
      color: #fff;
      flex-shrink: 0;
    }

    .info-name {
      margin: 0 0 10px;
      font-size: 22px;
      color: var(--el-text-color-primary);
    }

    .info-meta {
      margin: 0 0 4px;
      font-size: 13px;
      color: var(--el-text-color-secondary);
    }
  }

  .profile-form {
    max-width: 420px;
  }
}
</style>
