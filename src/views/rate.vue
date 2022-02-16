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
        <el-button type="primary" @click="handleAdd">添加</el-button>
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
        <el-table-column prop="levelId" label="等级"></el-table-column>
        <el-table-column prop="name" label="等级名称"></el-table-column>
        <el-table-column label="充值金额">
          <template #default="scope"
            >{{ scope.row.numberStart }} - {{ scope.row.numberEnd }}</template
          >
        </el-table-column>
        <el-table-column prop="incomeRate" label="日收益%"> </el-table-column>
        <el-table-column prop="withdrawRate" label="日提款%"></el-table-column>
        <el-table-column prop="inviteRate" label="邀请返利tx">
          <template #default="scope">{{
            handRate(scope.row.inviteRate)
          }}</template>
        </el-table-column>
        <el-table-column prop="rechargeRate" label="充值返利%">
          <template #default="scope">{{
            handRate(scope.row.rechargeRate)
          }}</template>
        </el-table-column>
        <el-table-column prop="miningRate" label="挖矿返利%">
          <template #default="scope">{{
            handRate(scope.row.miningRate)
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑
            </el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
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

    <!-- 添加弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="50%">
      <el-form label-width="100px">
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
        <el-form-item label="邀请返利">
          <el-col :span="2">lev1:</el-col>
          <el-col :span="3" style="margin: 0 10px">
            <el-input
              v-model="form.inviteRate.lev1"
              placeholder="lev1"
            ></el-input>
          </el-col>
          <el-col :span="2">lev2:</el-col>
          <el-col :span="3" style="margin: 0 10px">
            <el-input
              v-model="form.inviteRate.lev2"
              placeholder="lev2"
            ></el-input>
          </el-col>
          <el-col :span="2">lev3:</el-col>
          <el-col :span="3" style="margin: 0 10px">
            <el-input
              v-model="form.inviteRate.lev3"
              placeholder="lev3"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="充值返利">
          <el-col :span="2">lev1:</el-col>
          <el-col :span="3" style="margin: 0 10px">
            <el-input
              v-model="form.rechargeRate.lev1"
              placeholder="lev1"
            ></el-input>
          </el-col>
          <el-col :span="2">lev2:</el-col>
          <el-col :span="3" style="margin: 0 10px">
            <el-input
              v-model="form.rechargeRate.lev2"
              placeholder="lev2"
            ></el-input>
          </el-col>
          <el-col :span="2">lev3:</el-col>
          <el-col :span="3" style="margin: 0 10px">
            <el-input
              v-model="form.rechargeRate.lev3"
              placeholder="lev3"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="挖矿返利">
          <el-col :span="2">lev1:</el-col>
          <el-col :span="3" style="margin: 0 10px">
            <el-input
              v-model="form.miningRate.lev1"
              placeholder="lev1"
            ></el-input>
          </el-col>
          <el-col :span="2">lev2:</el-col>
          <el-col :span="3" style="margin: 0 10px">
            <el-input
              v-model="form.miningRate.lev2"
              placeholder="lev2"
            ></el-input>
          </el-col>
          <el-col :span="2">lev3:</el-col>
          <el-col :span="3" style="margin: 0 10px">
            <el-input
              v-model="form.miningRate.lev3"
              placeholder="lev3"
            ></el-input>
          </el-col>
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
    <el-dialog title="添加" v-model="addVisible" width="50%">
      <el-form label-width="100px">
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
        <el-form-item label="日提款">
          <el-input v-model="form.withdrawRate"></el-input>
        </el-form-item>
        <el-form-item label="邀请返利">
          <el-col :span="2">lev1:</el-col>
          <el-col :span="3" style="margin: 0 10px">
            <el-input
              v-model="form.inviteRate.lev1"
              placeholder="lev1"
            ></el-input>
          </el-col>
          <el-col :span="2">lev2:</el-col>
          <el-col :span="3" style="margin: 0 10px">
            <el-input
              v-model="form.inviteRate.lev2"
              placeholder="lev2"
            ></el-input>
          </el-col>
          <el-col :span="2">lev3:</el-col>
          <el-col :span="3" style="margin: 0 10px">
            <el-input
              v-model="form.inviteRate.lev3"
              placeholder="lev3"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="充值返利">
          <el-col :span="2">lev1:</el-col>
          <el-col :span="3" style="margin: 0 10px">
            <el-input
              v-model="form.rechargeRate.lev1"
              placeholder="lev1"
            ></el-input>
          </el-col>
          <el-col :span="2">lev2:</el-col>
          <el-col :span="3" style="margin: 0 10px">
            <el-input
              v-model="form.rechargeRate.lev2"
              placeholder="lev2"
            ></el-input>
          </el-col>
          <el-col :span="2">lev3:</el-col>
          <el-col :span="3" style="margin: 0 10px">
            <el-input
              v-model="form.rechargeRate.lev3"
              placeholder="lev3"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="挖矿返利">
          <el-col :span="2">lev1:</el-col>
          <el-col :span="3" style="margin: 0 10px">
            <el-input
              v-model="form.miningRate.lev1"
              placeholder="lev1"
            ></el-input>
          </el-col>
          <el-col :span="2">lev2:</el-col>
          <el-col :span="3" style="margin: 0 10px">
            <el-input
              v-model="form.miningRate.lev2"
              placeholder="lev2"
            ></el-input>
          </el-col>
          <el-col :span="2">lev3:</el-col>
          <el-col :span="3" style="margin: 0 10px">
            <el-input
              v-model="form.miningRate.lev3"
              placeholder="lev3"
            ></el-input>
          </el-col>
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
import { Server } from "../api/rate";
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
      ser.page(query).then((res) => {
        res.data.list.forEach((l) => {
          l.createTime = moment(l.createTime).format("MM-DD HH:mm");
        });
        tableData.value = res.data.list;
        pageTotal.value = res.data.pagination.total;
      });
    };
    getData();
    const handRate = (rate) => {
      rate = JSON.parse(rate || "{}");
      return `lev1:${rate.lev1 || 0},
          lev2:${rate.lev2 || 0},
          lev3:${rate.lev3 || 0}`;
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
      inviteRate: {
        lev1: 0,
        lev2: 0,
        lev3: 0,
      },
      rechargeRate: {
        lev1: 0,
        lev2: 0,
        lev3: 0,
      },
      miningRate: {
        lev1: 0,
        lev2: 0,
        lev3: 0,
      },
    });
    let idx = -1;
    const handleEdit = (index, row) => {
      idx = index;
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
      if (form.inviteRate)
        form.inviteRate = JSON.parse(form.inviteRate || "{}");
      if (form.rechargeRate)
        form.rechargeRate = JSON.parse(form.rechargeRate || "{}");
      if (form.miningRate)
        form.miningRate = JSON.parse(form.miningRate || "{}");
      editVisible.value = true;
    };
    const saveEdit = () => {
      editVisible.value = false;
      form.inviteRate = JSON.stringify(form.inviteRate);
      form.rechargeRate = JSON.stringify(form.rechargeRate);
      form.miningRate = JSON.stringify(form.miningRate);
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
      form.id = undefined;
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
      handRate,
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
  font-size: 14px;
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
