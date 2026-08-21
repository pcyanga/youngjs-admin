<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Plus, Refresh, Search } from '@element-plus/icons-vue'
import { addUser, deleteUser, getUserById, getUserPage, updateUser } from '@/api/user'
import { getRoleList } from '@/api/role'
import { formatTime } from '@/utils'
import type { RoleItem, UserItem } from '@/types/api'

defineOptions({ name: 'SystemUser' })

const loading = ref(false)
const tableData = ref<UserItem[]>([])
const pageTotal = ref(0)
const query = reactive({
  keywords: '',
  page: 1,
  size: 10,
})

const getData = async () => {
  loading.value = true
  try {
    const res = await getUserPage(query)
    tableData.value = res.list
    pageTotal.value = res.pagination.total
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  query.page = 1
  getData()
}

const handleReset = () => {
  query.keywords = ''
  handleSearch()
}

/* ---------- 新增 / 编辑 ---------- */
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const roles = ref<RoleItem[]>([])

const form = reactive<{
  id: number
  username: string
  nickname: string
  password: string
  roleIds: number[]
  status: boolean
}>({
  id: 0,
  username: '',
  nickname: '',
  password: '',
  roleIds: [],
  status: true,
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  password: [
    {
      required: true,
      validator: (_rule, value, callback) => {
        if (isEdit.value && !value) return callback()
        if (!value) return callback(new Error('请输入密码'))
        callback()
      },
      trigger: 'blur',
    },
  ],
}

const openAdd = () => {
  isEdit.value = false
  dialogTitle.value = '添加用户'
  Object.assign(form, { id: 0, username: '', nickname: '', password: '', roleIds: [], status: true })
  formRef.value?.clearValidate()
  dialogVisible.value = true
}

const openEdit = async (row: UserItem) => {
  isEdit.value = true
  dialogTitle.value = '编辑用户'
  const detail = await getUserById(row.id)
  Object.assign(form, {
    id: detail.id,
    username: detail.username,
    nickname: detail.nickname,
    password: '',
    roleIds: Array.isArray((detail as UserItem & { roleIds?: number[] }).roleIds)
      // bigint/int 经 mysql2 驱动可能返回 string，统一转 number 保证与 el-option 的 value 严格匹配
      ? (detail as UserItem & { roleIds?: number[] }).roleIds!.map(Number)
      : [],
    status: detail.status,
  })
  formRef.value?.clearValidate()
  dialogVisible.value = true
}

const handleSave = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    const payload = {
      ...form,
      // 编辑时未修改密码则不提交密码
      ...(isEdit.value && !form.password ? { password: undefined } : {}),
    }
    if (isEdit.value) {
      await updateUser(payload)
    } else {
      await addUser(payload)
    }
    ElMessage.success('操作成功')
    dialogVisible.value = false
    getData()
  })
}

/* ---------- 删除 ---------- */
const handleDelete = async (row: UserItem) => {
  await ElMessageBox.confirm(`确定要删除用户「${row.username}」吗？`, '删除确认', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消',
  })
  await deleteUser(row.id)
  ElMessage.success('删除成功')
  getData()
}

onMounted(async () => {
  getData()
  // Base.id 为 bigint，mysql2 返回 string，统一转 number 与 form.roleIds 匹配
  roles.value = (await getRoleList()).map((r) => ({ ...r, id: Number(r.id) }))
})
</script>

<template>
  <div class="page-container">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form inline @submit.prevent>
        <el-form-item label="关键词">
          <el-input
            v-model="query.keywords"
            placeholder="用户名 / 昵称"
            clearable
            style="width: 220px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card shadow="never">
      <div class="table-toolbar">
        <el-button type="primary" :icon="Plus" @click="openAdd">新增用户</el-button>
      </div>

      <el-table v-loading="loading" :data="tableData" stripe>
        <el-table-column prop="id" label="ID" width="70" align="center" />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'">
              {{ row.status ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="IP" prop="ip" min-width="120" show-overflow-tooltip />
        <el-table-column label="创建时间" min-width="160">
          <template #default="{ row }">{{ formatTime(row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无数据" />
        </template>
      </el-table>

      <div class="table-pagination">
        <el-pagination
          v-model:current-page="query.page"
          v-model:page-size="query.size"
          :total="pageTotal"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @change="getData"
        />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="480px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            :placeholder="isEdit ? '留空则不修改' : '请输入密码'"
          />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.roleIds" multiple placeholder="请选择角色" style="width: 100%">
            <el-option v-for="role in roles" :key="role.id" :label="role.rolename" :value="role.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" active-text="启用" inactive-text="禁用" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .search-card {
    :deep(.el-card__body) {
      padding-bottom: 0;
    }
  }

  .table-toolbar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
  }

  .table-pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
}
</style>
