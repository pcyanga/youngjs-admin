<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Plus, Refresh, Search } from '@element-plus/icons-vue'
import { addTask, deleteTask, getTaskLogPage, getTaskPage, runTaskNow, updateTask } from '@/api/task'
import { formatTime } from '@/utils'
import type { TaskItem, TaskLogItem } from '@/types/api'

defineOptions({ name: 'SystemTask' })

const loading = ref(false)
const tableData = ref<TaskItem[]>([])
const pageTotal = ref(0)
const query = reactive({ keywords: '', page: 1, size: 10 })

const getData = async () => {
  loading.value = true
  try {
    const res = await getTaskPage(query)
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

const form = reactive({
  id: 0,
  name: '',
  type: 0,
  cron: '',
  every: 60,
  limit: 1,
  service: '',
  status: true,
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  cron: [
    {
      required: true,
      validator: (_rule, value, callback) => {
        if (form.type === 1 && !value) return callback(new Error('请输入 cron 表达式'))
        callback()
      },
      trigger: 'blur',
    },
  ],
  service: [{ required: true, message: '请输入任务 service', trigger: 'blur' }],
}

const openAdd = () => {
  isEdit.value = false
  dialogTitle.value = '添加任务'
  Object.assign(form, { id: 0, name: '', type: 0, cron: '', every: 60, limit: 1, service: '', status: true })
  dialogVisible.value = true
}

const openEdit = (row: TaskItem) => {
  isEdit.value = true
  dialogTitle.value = '编辑任务'
  Object.assign(form, {
    id: row.id,
    name: row.name,
    type: row.type,
    cron: row.cron || '',
    every: row.every || 60,
    limit: row.limit,
    service: row.service,
    status: row.status,
  })
  dialogVisible.value = true
}

const handleSave = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    if (isEdit.value) {
      await updateTask(form)
    } else {
      await addTask(form)
    }
    ElMessage.success('操作成功')
    dialogVisible.value = false
    getData()
  })
}

/* ---------- 立即执行 / 删除 ---------- */
const handleRun = async (row: TaskItem) => {
  await runTaskNow(row.id)
  ElMessage.success('已触发执行')
  getData()
}

const handleDelete = async (row: TaskItem) => {
  await ElMessageBox.confirm(`确定要删除任务「${row.name}」吗？`, '删除确认', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消',
  })
  await deleteTask(row.id)
  ElMessage.success('删除成功')
  getData()
}

/* ---------- 执行日志 ---------- */
const logVisible = ref(false)
const logLoading = ref(false)
const logData = ref<TaskLogItem[]>([])
const logTotal = ref(0)
const logQuery = reactive({ taskId: 0, page: 1, size: 10 })

const openLog = (row: TaskItem) => {
  logQuery.taskId = row.id
  logQuery.page = 1
  getLogData()
  logVisible.value = true
}

const getLogData = async () => {
  logLoading.value = true
  try {
    const res = await getTaskLogPage(logQuery)
    logData.value = res.list
    logTotal.value = res.pagination.total
  } finally {
    logLoading.value = false
  }
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
            placeholder="任务名称"
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
        <el-button type="primary" :icon="Plus" @click="openAdd">新增任务</el-button>
      </div>

      <el-table v-loading="loading" :data="tableData" stripe>
        <el-table-column prop="id" label="ID" width="70" align="center" />
        <el-table-column prop="name" label="任务名称" min-width="140" />
        <el-table-column label="类型" width="120" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.type === 1" type="warning">cron</el-tag>
            <el-tag v-else type="info">每隔 {{ row.every }} 秒</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="service" label="Service" min-width="160" show-overflow-tooltip />
        <el-table-column prop="limit" label="限流(次)" width="100" align="center" />
        <el-table-column label="下次执行时间" min-width="160">
          <template #default="{ row }">{{ formatTime(row.nextRunTime) }}</template>
        </el-table-column>
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'">{{ row.status ? '启用' : '停用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="warning" @click="openLog(row)">日志</el-button>
            <el-button link type="success" @click="handleRun(row)">执行</el-button>
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="520px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="form.type">
            <el-radio :value="1">cron 表达式</el-radio>
            <el-radio :value="0">固定间隔</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.type === 1" label="cron" prop="cron">
          <el-input v-model="form.cron" placeholder="如 0 */1 * * * ?" />
        </el-form-item>
        <el-form-item v-else label="间隔(秒)">
          <el-input-number v-model="form.every" :min="1" :max="86400" />
        </el-form-item>
        <el-form-item label="service" prop="service">
          <el-input v-model="form.service" placeholder="如 task/xxx" />
        </el-form-item>
        <el-form-item label="限流(次)">
          <el-input-number v-model="form.limit" :min="1" :max="9999" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" active-text="启用" inactive-text="停用" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>

    <!-- 执行日志弹窗 -->
    <el-dialog v-model="logVisible" title="执行日志" width="720px" destroy-on-close>
      <el-table v-loading="logLoading" :data="logData" stripe>
        <el-table-column prop="id" label="ID" width="70" align="center" />
        <el-table-column prop="result" label="执行结果" min-width="260" show-overflow-tooltip />
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="执行时间" min-width="160">
          <template #default="{ row }">{{ formatTime(row.createTime) }}</template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无日志" />
        </template>
      </el-table>
      <div class="table-pagination">
        <el-pagination
          v-model:current-page="logQuery.page"
          v-model:page-size="logQuery.size"
          :total="logTotal"
          layout="total, prev, pager, next"
          background
          @change="getLogData"
        />
      </div>
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
