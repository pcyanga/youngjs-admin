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
        <el-table-column
          prop="sourceUserId"
          label="来源用户ID"
        ></el-table-column>
        <el-table-column prop="amount" label="总金额"></el-table-column>
        <el-table-column prop="balance" label="基础账户"></el-table-column>
        <el-table-column
          prop="commissionBalance"
          label="佣金账户"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="时间"
          sortable="desc"
        ></el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status == 1 ? 'success' : 'danger'">{{
              showStatus(scope.row.status)
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="场景" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status == 1 ? 'success' : 'danger'">{{
              showScene(scope.row.scene)
            }}</el-tag>
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
    <el-dialog title="添加" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="ID">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="等级">
          <el-input v-model="form.levelId"></el-input>
        </el-form-item>
        <el-form-item label="等级名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="充值金额起值">
          <el-input v-model="form.numberStart"></el-input>
        </el-form-item>
        <el-form-item label="充值金额始值">
          <el-input v-model="form.numberEnd"></el-input>
        </el-form-item>
        <el-form-item label="日收益">
          <el-input v-model="form.incomeRate"></el-input>
        </el-form-item>
        <el-form-item label="日提款">
          <el-input v-model="form.withdrawRate"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="addVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="ID">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="等级">
          <el-input v-model="form.levelId"></el-input>
        </el-form-item>
        <el-form-item label="等级名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="充值金额起值">
          <el-input v-model="form.numberStart"></el-input>
        </el-form-item>
        <el-form-item label="充值金额始值">
          <el-input v-model="form.numberEnd"></el-input>
        </el-form-item>
        <el-form-item label="日收益">
          <el-input v-model="form.incomeRate"></el-input>
        </el-form-item>
        <el-form-item label="日提款">
          <el-input v-model="form.withdrawRate"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveAdd">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Server } from "../api/profit";
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
          // switch (Number(l.status)) {
          //   case 0:
          //     l.status = "未匹配";
          //     break;
          //   case 1:
          //     l.status = "已匹配";
          //     break;
          //   case 2:
          //     l.status = "已入账";
          //     break;
          // }
        });
        tableData.value = res.data.list;
        pageTotal.value = res.data.pagination.total;
      });
    };
    const showStatus = (status) => {
      switch (status) {
        case 0:
          return "未领取";
        case 1:
          return "已入账";
      }
      return status;
    };
    //场景 1挖矿 2挖矿返利 3充值 4充值返利 5邀请返利
    const showScene = (status) => {
      switch (status) {
        case 1:
          return "挖矿";
        case 2:
          return "挖矿返利";
        case 3:
          return "充值";
        case 4:
          return "充值返利";
        case 5:
          return "邀请返利";
        case 6:
          return "注册礼金";
      }
      return status;
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
    const handleDelete = (index, rows) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          ser.delete({ ids: rows.id }).then((res) => {
            if (res.code == 1000) {
              ElMessage.success(`删除成功`);
              getData();
            } else {
              ElMessage.error(`删除失败:${res.message}`);
            }
          });
        })
        .catch(() => {});
    };

    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
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
    const handleEdit = (index, row) => {
      idx = index;
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
      editVisible.value = true;
    };
    const saveEdit = () => {
      editVisible.value = false;
      form.status == true ? 1 : 0;
      ser.update(form).then((res) => {
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
      editVisible,
      form,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleEdit,
      saveEdit,
      addVisible,
      handleAdd,
      saveAdd,
      dealStatus,
      changeTableSort,
      showStatus,
      showScene,
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
