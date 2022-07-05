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
          v-model="query.name"
          placeholder="任务名称"
          class="handle-input mr10"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch"
          >搜索</el-button
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
        <el-table-column label="定时内容">
          <template #default="scope">{{
            scope.row.type == 2 ? scope.row.cron : scope.row.every
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
            <el-button
              type="text"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
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
      <el-form label-width="70px">
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
        <el-form-item label="时间间隔" v-if="form.type == 1">
          <el-input v-model="form.every"></el-input>
        </el-form-item>
        <el-form-item label="次数限制">
          <el-input v-model="form.limit" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="执行方法">
          <el-input v-model="form.service" placeholder=""></el-input>
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
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Server } from "../api/task";
import moment from "moment";

export default {
  name: "basetable",
  setup() {
    const ser = new Server();
    const query = reactive({
      keyWord: "",
      page: 1,
      size: 10,
    });
    const tableData = ref([]);
    const pageTotal = ref(0);
    // 获取表格数据
    const getData = () => {
      ser.page(query).then((res) => {
        res.data.list.forEach((d) => {
          d.nextRunTime = moment(d.nextRunTime).format("YYYY-MM-DD HH:mm:ss");
          d.status = d.status == 1 ? true : false;
        });
        tableData.value = res.data.list;
        pageTotal.value = res.data.pagination.total || 50;
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
    const handleDelete = (index) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          ElMessage.success("删除成功");
          tableData.value.splice(index, 1);
        })
        .catch(() => {});
    };

    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    let form = reactive({
      name: "",
      type: "1",
      limit: "",
      cron: "",
      every: "",
      status: true,
    });
    const handleEdit = (row) => {
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
      form.type = String(form.type);
      editVisible.value = true;
    };
    const saveEdit = () => {
      editVisible.value = false;
      data.status = data.status ? 1 : 0;
      ser.update(data).then((res) => {
        if (res.code == 1000) {
          ElMessage.success(`修改成功`);
          getData();
        } else {
          ElMessage.error(`修改失败:${res.message}`);
        }
      });
    };

    const changeStatus = (data) => {
      data.status = data.status ? 1 : 0;
      ser.update(data).then((res) => {
        if (res.code == 1000) {
          ElMessage.success(`修改成功`);
          getData();
        } else {
          ElMessage.error(`修改失败:${res.message}`);
        }
      });
    };

    return {
      query,
      tableData,
      pageTotal,
      editVisible,
      form,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleEdit,
      saveEdit,
      changeStatus,
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
