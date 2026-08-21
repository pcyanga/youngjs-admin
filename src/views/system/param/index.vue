<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Plus, Refresh, Search } from '@element-plus/icons-vue'
import { addParam, deleteParam, getParamPage, updateParam } from '@/api/param'
import { formatTime } from '@/utils'
import type { ParamItem } from '@/types/api'

defineOptions({ name: 'SystemParam' })

const loading = ref(false)
const tableData = ref<ParamItem[]>([])
const pageTotal = ref(0)
const query = reactive({ keywords: '', page: 1, size: 10 })

const getData = async () => {
  loading.value = true
  try {
    const res = await getParamPage(query)
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

const form = reactive({ id: 0, key: '', value: '', remark: '' })

const rules: FormRules = {
  key: [{ required: true, message: '请输入参数键', trigger: 'blur' }],
  value: [{ required: true, message: '请输入参数值', trigger: 'blur' }],
}

const openAdd = () => {
  isEdit.value = false
  dialogTitle.value = '添加参数'
  Object.assign(form, { id: 0, key: '', value: '', remark: '' })
  dialogVisible.value = true
}

const openEdit = (row: ParamItem) => {
  isEdit.value = true
  dialogTitle.value = '编辑参数'
  Object.assign(form, { id: row.id, key: row.key, value: row.value, remark: row.remark || '' })
  dialogVisible.value = true
}

const handleSave = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    if (isEdit.value) {
      await updateParam(form)
    } else {
      await addParam(form)
    }
    ElMessage.success('操作成功')
    dialogVisible.value = false
    getData()
  })
}

const handleDelete = async (row: ParamItem) => {
  await ElMessageBox.confirm(`确定要删除参数「${row.key}」吗？`, '删除确认', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消',
  })
  await deleteParam(row.id)
  ElMessage.success('删除成功')
  getData()
}

onMounted(getData)
</script>

<template>
  <div class="page-container">
    <el-card shadow="never" class="search-card">
      <el-form inline @submit.prevent>
        <el-form-item label="关键词">
          <el-input
            v-model="query.keywords"
            placeholder="参数键"
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
        <el-button type="primary" :icon="Plus" @click="openAdd">新增参数</el-button>
      </div>

      <el-table v-loading="loading" :data="tableData" stripe>
        <el-table-column prop="id" label="ID" width="70" align="center" />
        <el-table-column prop="key" label="参数键" min-width="160" />
        <el-table-column prop="value" label="参数值" min-width="200" show-overflow-tooltip />
        <el-table-column prop="remark" label="备注" min-width="160" show-overflow-tooltip />
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
        <el-form-item label="参数键" prop="key">
          <el-input v-model="form.key" placeholder="请输入参数键" />
        </el-form-item>
        <el-form-item label="参数值" prop="value">
          <el-input v-model="form.value" placeholder="请输入参数值" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注" />
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
}
</style>
