<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 定时任务
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input
          v-model="query.keywords"
          placeholder="任务名称"
          class="handle-input mr10"
          size="mini"
        ></el-input>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="handleSearch"
          size="mini"
          >搜索</el-button
        >
        <el-button type="success" @click="handleAdd" size="mini"
          >添加</el-button
        >
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column prop="name" label="任务名称"></el-table-column>
        <el-table-column label="定时方式">
          <template #default="scope">{{
            scope.row.type == 2 ? "cron" : "时间间隔"
          }}</template>
        </el-table-column>
        <el-table-column label="执行时间">
          <template #default="scope">{{
            scope.row.type == 2 ? scope.row.cron : scope.row.every + "(ms/次)"
          }}</template>
        </el-table-column>
        <el-table-column label="次数限制">
          <template #default="scope">{{
            scope.row.limit == 0 ? "不限" : scope.row.limit
          }}</template>
        </el-table-column>
        <el-table-column prop="service" label="执行内容"></el-table-column>
        <el-table-column
          prop="nextRunTime"
          label="下次执行时间"
        ></el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              @change="changeStatus(scope.row)"
            >
            </el-switch
          ></template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button type="text" @click="handleEdit(scope.row)"
              >编辑
            </el-button>
            <el-button type="text" @click="log(scope.row)">日志</el-button>
            <el-button type="text" @click="doNow(scope.row.id)"
              >执行一次</el-button
            >
            <el-button type="text" class="red" @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.pageIndex"
          :page-size="query.pageSize"
          :total="pageTotal"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="100px">
        <el-form-item label="任务名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="定时方式">
          <el-select v-model="form.type">
            <el-option key="1" value="1" label="时间间隔"></el-option>
            <el-option key="2" value="2" label="cron"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="cron" v-if="form.type == 2">
          <el-input v-model="form.cron"></el-input>
        </el-form-item>
        <el-form-item label="时间间隔(ms)" v-if="form.type == 1">
          <el-input v-model="form.every" type="number"></el-input>
        </el-form-item>
        <el-form-item label="次数限制">
          <el-input
            v-model="form.limit"
            placeholder="不填则不限制"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="执行方法">
          <el-input
            v-model="form.service"
            placeholder="类名.方法名，例：Test.test()"
          ></el-input>
        </el-form-item>
        <el-form-item label="开关">
          <el-switch v-model="form.status"> </el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 新增弹出框 -->
    <el-dialog title="新增" v-model="addVisible" width="30%">
      <el-form label-width="100px">
        <el-form-item label="任务名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="定时方式">
          <el-select v-model="form.type">
            <el-option key="1" value="1" label="时间间隔"></el-option>
            <el-option key="2" value="2" label="cron"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="cron" v-if="form.type == 2">
          <el-input v-model="form.cron"></el-input>
        </el-form-item>
        <el-form-item label="时间间隔(ms)" v-if="form.type == 1">
          <el-input v-model="form.every" type="number"></el-input>
        </el-form-item>
        <el-form-item label="次数限制">
          <el-input
            v-model="form.limit"
            placeholder="不填则不限制"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="执行方法">
          <el-input
            v-model="form.service"
            placeholder="类名.方法名，例：Test.test()"
          ></el-input>
        </el-form-item>
        <el-form-item label="开关">
          <el-switch v-model="form.status"> </el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveAdd">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 日志 -->
    <el-dialog :title="title" v-model="logVisible" width="60%">
      <el-table
        :data="logTableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column label="结果">
          <template #default="scope">{{ scope.row.result }}</template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="scope">{{
            scope.row.status == 1 ? "成功" : "失败"
          }}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="执行时间"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="logQuery.page"
          :page-size="logQuery.size"
          :total="logPageTotal"
          @current-change="handlePageChange1"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Server } from "../api/api";
import moment from "moment";

export default {
  name: "basetable",
  setup() {
    const ser = new Server();
    const query = reactive({
      keywords: "",
      page: 1,
      size: 10,
    });
    const tableData = ref([]);
    const pageTotal = ref(0);
    // 获取表格数据
    const getData = () => {
      ser.req("system/task/page", query).then((res) => {
        if (res.code == 1000) {
          res.data.list.forEach((d) => {
            d.nextRunTime = moment(d.nextRunTime).format("YYYY-MM-DD HH:mm:ss");
            d.status = d.status == 1 ? true : false;
          });
          tableData.value = res.data.list;
          pageTotal.value = res.data.pagination.total || 50;
        }
      });
    };
    getData();

    // 查询操作
    const handleSearch = () => {
      query.pageIndex = 1;
      getData();
    };
    // 分页导航
    const handlePageChange = (val) => {
      query.pageIndex = val;
      getData();
    };

    // 删除操作
    // 删除操作
    const handleDelete = (rows) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          ser.req("system/task/delete", { ids: rows.id }).then((res) => {
            if (res.code == 1000) {
              ElMessage.success(`删除成功`);
              getData();
            }
          });
        })
        .catch(() => {});
    };

    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    const addVisible = ref(false);
    let form = reactive({
      id: 0,
      name: "",
      type: "1",
      limit: "",
      cron: "",
      every: "",
      status: true,
      service: "",
    });
    const handleAdd = () => {
      form.name = "";
      form.type = "1";
      form.cron = "";
      form.every = "";
      form.status = true;
      form.service = "";
      form.id = 0;
      addVisible.value = true;
    };
    const saveAdd = () => {
      editVisible.value = false;
      form.status = form.status ? 1 : 0;
      form.every = form.every || 0;
      form.limit = form.limit || 0;
      ser.req("system/task/add", form).then((res) => {
        if (res.code == 1000) {
          ElMessage.success(`添加成功`);
          addVisible.value = false;
          getData();
        }
      });
    };
    const handleEdit = (row) => {
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
      form.type = String(form.type);
      editVisible.value = true;
    };
    const saveEdit = () => {
      form.status = form.status ? 1 : 0;
      form.every = form.every || 0;
      form.limit = form.limit || 0;
      ser.req("system/task/update", form).then((res) => {
        if (res.code == 1000) {
          ElMessage.success(`修改成功`);
          editVisible.value = false;
          getData();
        }
      });
    };

    const changeStatus = (data) => {
      data.status = data.status ? 1 : 0;
      ser.req("system/task/update", data).then((res) => {
        if (res.code == 1000) {
          ElMessage.success(`修改成功`);
          editVisible.value = false;
          getData();
        }
      });
    };
    const logQuery = reactive({
      page: 1,
      size: 10,
      taskId: 0,
      order: { createTime: "desc" },
    });
    const title = ref("日志");
    const logVisible = ref(false);
    const logTableData = ref([]);
    const logPageTotal = ref(0);
    const log = (row) => {
      if (row) {
        title.value = `[${row.name}]日志`;
        logQuery.taskId = row.id;
      }
      ser.req("system/task_log/page", logQuery).then((res) => {
        if (res.code == 1000) {
          res.data.list.forEach((l) => {
            l.createTime = moment(l.createTime).format("MM-DD HH:mm");
          });
          logTableData.value = res.data.list;
          logPageTotal.value = res.data.pagination.total;
          logQuery.size = res.data.pagination.size;
          logQuery.page = res.data.pagination.page;
          logVisible.value = true;
        }
      });
    };
    const handlePageChange1 = (val) => {
      logQuery.page = val;
      log();
    };
    const doNow = (id) => {
      ser.req("system/task/doNow", { id }).then((res) => {
        if (res.code == 1000) {
          ElMessage.success(`执行成功`);
          getData();
        }
      });
    };
    return {
      query,
      tableData,
      pageTotal,
      editVisible,
      addVisible,
      form,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleEdit,
      saveEdit,
      changeStatus,
      handleAdd,
      saveAdd,
      title,
      logVisible,
      log,
      logQuery,
      logTableData,
      logPageTotal,
      handlePageChange1,
      doNow,
    };
  },
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 10px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
