<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { addMenu, deleteMenu, getMenuList, getRouters, updateMenu } from '@/api/menu'
import { resolveMenuIcon } from '@/utils/icons'
import IconPicker from '@/components/IconPicker/index.vue'
import type { MenuItem } from '@/types/api'

defineOptions({ name: 'SystemMenu' })

const loading = ref(false)
const tableData = ref<MenuItem[]>([])
const routerOptions = ref<unknown[]>([])

const getData = async () => {
  loading.value = true
  try {
    tableData.value = await getMenuList()
  } finally {
    loading.value = false
  }
}

/* ---------- 新增 / 编辑 ---------- */
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const form = reactive({
  id: 0,
  pid: 0,
  name: '',
  key: '',
  icon: '',
  type: 2,
  sort: 0,
  actions: '',
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  key: [{ required: true, message: '请输入路径/标识', trigger: 'blur' }],
}

/** 父级菜单下拉数据（根目录 + 菜单树） */
const parentOptions = computed(() => [{ id: 0, label: '根目录', children: tableData.value }])

/** 接口权限：actions 字符串 <-> 级联数组 */
const actionsCascader = ref<string[][]>([])

const actionsToArray = (str?: string): string[][] => {
  if (!str) return []
  return str
    .split(';')
    .filter(Boolean)
    .map((item) => item.split('/'))
}

const arrayToActions = (arr: string[][]): string => arr.map((item) => item.join('/')).join(';')

const openAdd = (parent?: MenuItem) => {
  isEdit.value = false
  dialogTitle.value = '添加菜单'
  Object.assign(form, {
    id: 0,
    pid: parent?.id ?? 0,
    name: '',
    key: '',
    icon: '',
    type: 2,
    sort: 0,
    actions: '',
  })
  actionsCascader.value = []
  dialogVisible.value = true
}

const openEdit = (row: MenuItem) => {
  isEdit.value = true
  dialogTitle.value = '编辑菜单'
  Object.assign(form, {
    id: row.id,
    pid: row.pid,
    name: row.name,
    key: row.key || '',
    icon: row.icon || '',
    type: Number(row.type),
    sort: row.sort || 0,
    actions: row.actions || '',
  })
  actionsCascader.value = actionsToArray(form.actions)
  dialogVisible.value = true
}

const handleSave = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    const payload = { ...form, actions: arrayToActions(actionsCascader.value) }
    if (isEdit.value) {
      await updateMenu(payload)
    } else {
      await addMenu(payload)
    }
    ElMessage.success('操作成功')
    dialogVisible.value = false
    getData()
  })
}

const handleDelete = async (row: MenuItem) => {
  await ElMessageBox.confirm(`确定要删除菜单「${row.name}」吗？`, '删除确认', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消',
  })
  await deleteMenu(row.id)
  ElMessage.success('删除成功')
  getData()
}

onMounted(async () => {
  getData()
  routerOptions.value = await getRouters()
})
</script>

<template>
  <div class="page-container">
    <el-card shadow="never">
      <div class="table-toolbar">
        <el-button type="primary" :icon="Plus" @click="openAdd()">新增菜单</el-button>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        row-key="id"
        :tree-props="{ children: 'children' }"
        default-expand-all
      >
        <el-table-column prop="name" label="菜单名称" min-width="180" />
        <el-table-column prop="key" label="路径/标识" min-width="140" show-overflow-tooltip />
        <el-table-column label="图标" width="70" align="center">
          <template #default="{ row }">
            <el-icon :size="18"><component :is="resolveMenuIcon(row.icon)" /></el-icon>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="80" align="center">
          <template #default="{ row }">
            <el-tag v-if="Number(row.type) === 1" type="warning">目录</el-tag>
            <el-tag v-else-if="Number(row.type) === 2" type="success">菜单</el-tag>
            <el-tag v-else type="info">权限</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" align="center" />
        <el-table-column label="操作" width="220" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openAdd(row)">新增</el-button>
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无数据" />
        </template>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="560px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="上级菜单">
          <el-tree-select
            v-model="form.pid"
            :data="parentOptions"
            node-key="id"
            :props="{ label: 'label', children: 'children' }"
            check-strictly
            :render-after-expand="false"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="菜单显示名称" />
        </el-form-item>
        <el-form-item label="路径/标识" prop="key">
          <el-input v-model="form.key" placeholder="如 dashboard，与页面 key 对应" />
        </el-form-item>
        <el-form-item label="图标">
          <IconPicker v-model="form.icon" />
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="form.type">
            <el-radio :value="1">目录</el-radio>
            <el-radio :value="2">菜单</el-radio>
            <el-radio :value="3">权限</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" :max="9999" />
        </el-form-item>
        <el-form-item v-if="form.type === 3" label="接口权限">
          <el-cascader
            v-model="actionsCascader"
            :options="routerOptions"
            :props="{ checkStrictly: true, emitPath: true }"
            multiple
            clearable
            collapse-tags
            style="width: 100%"
          />
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

  .table-toolbar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
  }
}
</style>
