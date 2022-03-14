<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 用户列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" @click="handleSearch">刷新</el-button>
        <el-select v-model="query.agent" placeholder="代理筛选" clearable>
          <el-option
            v-for="a in agent"
            :key="a.code"
            :label="a.name"
            :value="a.code"
          ></el-option>
        </el-select>
        <el-input
          v-model="query.keywords"
          placeholder="ID/邮箱"
          class="handle-input mr10"
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
      >
        <el-table-column
          prop="id"
          label="ID/邀请码"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column label="基础账户余额">
          <template #default="scope">{{ scope.row.balance }}</template>
        </el-table-column>
        <el-table-column label="佣金账户余额">
          <template #default="scope">{{
            scope.row.commissionBalance
          }}</template>
        </el-table-column>
        <el-table-column prop="agent" label="代理代号"></el-table-column>
        <el-table-column prop="createTime" label="注册时间"></el-table-column>
        <el-table-column prop="address" label="账户"></el-table-column>
        <el-table-column prop="levelId" label="等级"></el-table-column>
        <el-table-column prop="lev1" label="lev1"></el-table-column>
        <!-- <el-table-column prop="lev2" label="lev2"></el-table-column>
        <el-table-column prop="lev3" label="lev3"></el-table-column> -->
        <el-table-column prop="ip" label="ip"></el-table-column>
        <el-table-column prop="ipAddr" label="ip地址"></el-table-column>
        <el-table-column prop="recharge" label="总充值"></el-table-column>
        <el-table-column prop="withdraw" label="总提现"></el-table-column>

        <el-table-column
          prop="googleSecret"
          label="谷歌验证码"
        ></el-table-column>
        <el-table-column prop="createTime" label="注册时间"></el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status == 1 ? 'success' : 'danger'">{{
              scope.row.status == 1
                ? "启用"
                : scope.row.status == 2
                ? "禁IP"
                : "禁用"
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="提现状态" align="center">
          <template #default="scope">
            <el-tag
              :type="scope.row.withdrawStatus == 1 ? 'success' : 'danger'"
              >{{
                scope.row.withdrawStatus == 1 ? "可提现" : "不可提现"
              }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
              >编辑
            </el-button>
            <el-button
              type="text"
              v-if="addMoneyBtn"
              @click="handleMoney(scope.row, 9)"
              >赠送（基础）
            </el-button>
            <el-button
              type="text"
              v-if="addMoneyBtn1"
              @click="handleMoney(scope.row, 10)"
              >赠送（佣金）
            </el-button>
            <el-button type="text" @click="handleTeam(scope.row)"
              >查看下级
            </el-button>
            <el-button type="text" @click="handleRefresh(scope.row)"
              >刷新充值
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
          :current-page="query.page"
          :page-size="query.size"
          :total="pageTotal"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="100px">
        <el-form-item label="ID">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" placeholder="不填则不改"></el-input>
        </el-form-item>
        <el-form-item label="安全密码">
          <el-input
            v-model="form.safePassword"
            placeholder="不填则不改"
          ></el-input>
        </el-form-item>
        <el-form-item label="基础账户余额">
          <el-input v-model="form.balance"></el-input>
        </el-form-item>
        <el-form-item label="佣金账户余额">
          <el-input v-model="form.commissionBalance"></el-input>
        </el-form-item>
        <!-- <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status"></el-switch>
        </el-form-item> -->
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">禁IP</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="提现状态" prop="withdrawStatus">
          <el-switch v-model="form.withdrawStatus"></el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="活动赠送" v-model="moneyVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="金额">
          <el-input v-model="form1.amount" type="number"></el-input>
        </el-form-item>
        <!-- <el-form-item label="类型">
          <el-radio-group v-model="form1.scene">
            <el-radio :label="9">活动赠送(基础账户)</el-radio>
            <el-radio :label="10">活动赠送(佣金账户)</el-radio>
          </el-radio-group>
        </el-form-item> -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="moneyVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveMoney">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑弹出框 -->
    <el-dialog title="团队" v-model="teamVisible" width="60%">
      <div class="handle-box" @change="handleTeamChange">
        <el-radio-group v-model="query1.lev">
          <el-radio-button label="1">lev1</el-radio-button>
          <el-radio-button label="2">lev2</el-radio-button>
          <el-radio-button label="3">lev3</el-radio-button>
        </el-radio-group>
      </div>
      <el-table
        :data="tableData1"
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
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column label="账户余额">
          <template #default="scope">{{ scope.row.balance }}</template>
        </el-table-column>
        <el-table-column label="佣金余额">
          <template #default="scope">{{
            scope.row.commissionBalance
          }}</template>
        </el-table-column>
        <el-table-column prop="levelId" label="等级"></el-table-column>
        <el-table-column prop="recharge" label="充值金额"></el-table-column>
        <el-table-column prop="withdraw" label="提现金额"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query1.page"
          :page-size="query1.size"
          :total="pageTotal1"
          @current-change="handlePageChange1"
        ></el-pagination>
      </div>
      <div>
        总计：充值:<span class="amount">{{ subData.recharge }}</span
        >，提现:<span class="amount">{{ subData.withdraw }}</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Server } from "../api/user";
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
      agent: "",
    });
    const agent = ref([]);
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
    const getAgent = () => {
      ser.agentList(query).then((res) => {
        agent.value = res.data;
      });
    };
    getAgent();
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
      email: "",
      password: "",
      safePassword: "",
      balance: 0,
      commissionBalance: 0,
      status: 1,
      code: "",
      withdrawStatus: true,
    });
    const handleEdit = (row) => {
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
      // if (row.status == true) form.status = true;
      form.status = Number(form.status);
      form.withdrawStatus = form.withdrawStatus ? true : false;
      form.password = "";
      form.safePassword = "";
      editVisible.value = true;
    };
    const saveEdit = () => {
      editVisible.value = false;
      form.withdrawStatus = form.withdrawStatus == true ? 1 : 0;
      // form.status == true ? 1 : 0;
      ser.update(form).then((res) => {
        console.log(res);
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
    const teamVisible = ref(false);
    const tableData1 = ref([]);
    const pageTotal1 = ref(0);
    const query1 = reactive({
      lev: 1,
      page: 1,
      size: 10,
      userId: 0,
    });
    const handleTeam = (data) => {
      query1.userId = data.id;
      handleTeamChange();
    };
    let subData = {
      recharge: 0,
      withdraw: 0,
    };
    const handleTeamChange = () => {
      ser.team(query1).then((res) => {
        if (res.code == 1000) {
          subData.recharge = res.data.subData.recharge;
          subData.withdraw = res.data.subData.withdraw;
          tableData1.value = res.data.list;
          pageTotal1.value = res.data.pagination.total;
          query1.size = res.data.pagination.size;
          query1.page = res.data.pagination.page;
          teamVisible.value = true;
        } else {
          ElMessage.error(`获取失败:${res.message}`);
        }
      });
    };
    const moneyVisible = ref(false);
    let form1 = reactive({
      userId: 0,
      amount: 0,
      scene: 9,
    });
    const handleMoney = (data, scene) => {
      form1.userId = data.id;
      form1.amount = 0;
      form1.scene = scene || 9;
      moneyVisible.value = true;
    };
    const saveMoney = () => {
      ser.addMoney(form1).then((res) => {
        if (res.code == 1000) {
          ElMessage.success(`操作成功`);
          moneyVisible.value = false;
          getData();
        } else {
          ElMessage.error(`操作失败:${res.message}`);
        }
      });
    };
    const addMoneyBtn = ref(false);
    const addMoneyBtn1 = ref(false);
    let menu = localStorage.getItem("menu");
    menu = JSON.parse(menu);
    menu.forEach((m) => {
      console.log(m.key);
      if (m.key == "/member/addMoney") addMoneyBtn.value = true;
      m.children.forEach((c) => {
        if (c.key == "/member/addMoney") addMoneyBtn.value = true;
      });
      m.children.forEach((c) => {
        if (c.key == "/member/addMoney1") addMoneyBtn1.value = true;
      });
    });
    // 分页导航
    const handlePageChange1 = (val) => {
      query1.page = val;
      handleTeamChange();
    };
    const handleRefresh = (data) => {
      ser.refresh({ userId: data.id }).then((res) => {
        if (res.code == 1000) {
          ElMessage.success(`正在刷新，请稍后查看`);
        } else {
          ElMessage.error(`操作失败:${res.message}`);
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
      teamVisible,
      handleTeam,
      tableData1,
      pageTotal1,
      query1,
      handleTeamChange,
      subData,
      agent,
      moneyVisible,
      form1,
      handleMoney,
      saveMoney,
      addMoneyBtn,
      addMoneyBtn1,
      handlePageChange1,
      handleRefresh,
    };
  },
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}
.amount {
  color: red;
  font-size: 20px;
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
