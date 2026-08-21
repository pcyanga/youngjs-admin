<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Plus, Refresh, Search } from '@element-plus/icons-vue'
import type { TreeInstance } from 'element-plus'
import { addRole, deleteRole, getRoleMenu, getRolePage, updateRole } from '@/api/role'
import { getMenuList } from '@/api/menu'
import { formatTime } from '@/utils'
import type { MenuItem, RoleItem } from '@/types/api'

defineOptions({ name: 'SystemRole' })

const loading = ref(false)
const tableData = ref<RoleItem[]>([])
const pageTotal = ref(0)
const query = reactive({ keywords: '', page: 1, size: 10 })

const getData = async () => {
  loading.value = true
  try {
    const res = await getRolePage(query)
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
const treeRef = ref<TreeInstance>()
const menuTree = ref<MenuItem[]>([])

const form = reactive({ id: 0, rolename: '', menuIds: [] as number[] })

const rules: FormRules = {
  rolename: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
}

const openAdd = () => {
  isEdit.value = false
  dialogTitle.value = '添加角色'
  Object.assign(form, { id: 0, rolename: '', menuIds: [] })
  dialogVisible.value = true
}

const openEdit = async (row: RoleItem) => {
  isEdit.value = true
  dialogTitle.value = '编辑角色'
  // menuId 为 int 列可能返回 number，菜单树 id 为 bigint 返回 string，统一转 number 保证 el-tree 勾选回显
  const menuIds = (await getRoleMenu(row.id)).map(Number)
  Object.assign(form, { id: row.id, rolename: row.rolename, menuIds })
  dialogVisible.value = true
}

/** 收集勾选 + 半选的菜单 id */
const handleSave = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    const checkedKeys = treeRef.value?.getCheckedKeys(false) || []
    const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys() || []
    const menuIds = [...checkedKeys, ...halfCheckedKeys]
    const payload = { id: form.id, rolename: form.rolename, menuIds }
    if (isEdit.value) {
      await updateRole(payload)
    } else {
      await addRole(payload)
    }
    ElMessage.success('操作成功')
    dialogVisible.value = false
    getData()
  })
}

const handleDelete = async (row: RoleItem) => {
  await ElMessageBox.confirm(`确定要删除角色「${row.rolename}」吗？`, '删除确认', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消',
  })
  await deleteRole(row.id)
  ElMessage.success('删除成功')
  getData()
}

/** 递归将菜单树 id 统一转 number（后端 bigint 经 mysql2 返回 string），保证 el-tree node-key 与 menuIds 类型一致 */
const toNumberTree = (list: MenuItem[]): MenuItem[] =>
  list.map((m) => ({ ...m, id: Number(m.id), children: m.children ? toNumberTree(m.children) : undefined }))

onMounted(async () => {
  getData()
  menuTree.value = toNumberTree(await getMenuList())
})
</script>

<template>
  <div class="page-container">
    <el-card shadow="never" class="search-card">
      <el-form inline @submit.prevent>
        <el-form-item label="关键词">
          <el-input
            v-model="query.keywords"
            placeholder="角色名称"
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

    <el-card shadow="never">
      <div class="table-toolbar">
        <el-button type="primary" :icon="Plus" @click="openAdd">新增角色</el-button>
      </div>

      <el-table v-loading="loading" :data="tableData" stripe>
        <el-table-column prop="id" label="ID" width="70" align="center" />
        <el-table-column prop="rolename" label="角色名称" min-width="160" />
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="480px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="rolename">
          <el-input v-model="form.rolename" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="菜单权限">
          <div class="tree-wrapper">
            <el-tree
              ref="treeRef"
              :data="menuTree"
              :props="{ label: 'label' }"
              node-key="id"
              show-checkbox
              default-expand-all
              :default-checked-keys="form.menuIds"
            />
          </div>
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

  .search-card :deep(.el-card__body) {
    padding-bottom: 0;
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

  .tree-wrapper {
    width: 100%;
    max-height: 320px;
    overflow-y: auto;
    border: 1px solid var(--el-border-color-light);
    border-radius: 6px;
    padding: 8px;
  }
}
</style>
