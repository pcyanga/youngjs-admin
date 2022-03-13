<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 比例设置
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" @click="handleSearch">刷新</el-button>
        <el-input
          v-model="query.userId"
          placeholder="用户ID"
          class="handle-input mr10 ml10"
          clearable
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
        @sort-change="changeTableSort"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column prop="userId" label="用户ID"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="fromAccount" label="充值账户"></el-table-column>
        <el-table-column prop="toAccount" label="接收账户"></el-table-column>
        <el-table-column label="充值金额">
          <template #default="scope">{{ scope.row.amount }}</template>
        </el-table-column>
        <el-table-column label="账户类型" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.type == 1 ? '' : 'danger'">{{
              scope.row.type == 1 ? "基础账户" : "佣金账户"
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="rechargeTime" label="到账时间"></el-table-column>
        <el-table-column prop="reason" label="不通过原因"></el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag
              :type="scope.row.status == '提现成功' ? 'success' : 'danger'"
              >{{ scope.row.status }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="申请时间"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              v-if="scope.row.status == '审核中'"
              @click="handlePass(scope.$index, scope.row)"
              >打款
            </el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleReject(scope.$index, scope.row)"
              >不通过</el-button
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

    <!-- 添加弹出框 -->
    <el-dialog title="填写不通过原因" v-model="rejectVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="ID">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="原因">
          <el-input v-model="form.reason"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="rejectVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveReject">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Server } from "../api/withdraw";
import moment from "moment";
export default {
  name: "basetable",
  setup() {
    const ser = new Server();
    const query = reactive({
      keywords: "",
      page: 1,
      size: 10,
      order: { createTime: "desc" },
      userId: "",
    });
    const tableData = ref([]);
    const pageTotal = ref(0);
    // 获取表格数据
    const getData = () => {
      ser.page(query).then((res) => {
        res.data.list.forEach((l) => {
          l.rechargeTime = moment(l.rechargeTime).format("MM-DD HH:mm:ss");
          l.createTime = moment(l.createTime).format("MM-DD HH:mm:ss");
          //0审核中 1审核通过 2提现成功 3审核失败 4提现失败
          switch (Number(l.status)) {
            case 0:
              l.status = "审核中";
              break;
            case 1:
              l.status = "通过";
              break;
            case 2:
              l.status = "提现成功";
              break;
            case 3:
              l.status = "不通过";
              break;
            case 4:
              l.status = "提现失败";
              break;
          }
        });
        tableData.value = res.data.list;
        pageTotal.value = res.data.pagination.total;
      });
    };
    getData();
    const changeTableSort = (column) => {
      const sort = column.order == "descending" ? "desc" : "asc";
      query.order = {};
      query.order[column.prop] = sort;
      getData();
    };
    // 查询操作
    const handleSearch = () => {
      query.page = 1;
      getData();
    };
    // 分页导航
    const handlePageChange = (val) => {
      query.page = val;
      getData();
    };

    // 删除操作
    const handlePass = (index, rows) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要打款吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          ser.update({ id: rows.id, status: 1 }).then((res) => {
            if (res.code == 1000) {
              ElMessage.success(`后台打款中`);
              getData();
            } else {
              ElMessage.error(`操作失败:${res.message}`);
            }
          });
        })
        .catch(() => {});
    };

    // 表格编辑时弹窗和保存
    const rejectVisible = ref(false);
    let form = reactive({
      id: 0,
      levelId: 1,
      name: "",
      numberStart: 0,
      numberEnd: 0,
      incomeRate: 0,
      withdrawRate: 0,
    });
    let idx = -1;
    const handleReject = (index, row) => {
      form.id = row.id;
      rejectVisible.value = true;
    };
    const saveReject = () => {
      rejectVisible.value = false;
      form.status = 3;
      ser
        .update({ status: 3, reason: form.reason, id: form.id })
        .then((res) => {
          if (res.code == 1000) {
            ElMessage.success(`修改成功`);
            getData();
          } else {
            ElMessage.error(`修改失败:${res.message}`);
          }
        });
      // Object.keys(form).forEach((item) => {
      //   tableData.value[idx][item] = form[item];
      // });
    };
    const addVisible = ref(false);
    const handleAdd = () => {
      addVisible.value = true;
    };
    const saveAdd = () => {
      ser.add(form).then((res) => {
        if (res.code == 1000) {
          ElMessage.success(`添加成功`);
          addVisible.value = false;
          getData();
        } else {
          ElMessage.error(`添加失败:${res.message}`);
        }
      });
      // Object.keys(form).forEach((item) => {
      //   tableData.value[idx][item] = form[item];
      // });
    };
    const dealStatus = (status) => {
      console.log(status);
      switch (Number(status)) {
        case 0:
          return "未匹配";
        case 1:
          return "已匹配";
        case 2:
          return "已入账";
      }
    };
    return {
      query,
      tableData,
      pageTotal,
      rejectVisible,
      form,
      handleSearch,
      handlePageChange,
      handlePass,
      handleReject,
      saveReject,
      dealStatus,
      changeTableSort,
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
  width: 200px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin: 0 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
