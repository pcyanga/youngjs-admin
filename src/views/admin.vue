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
        <el-button type="primary" @click="handleAdd">添加</el-button>
        <el-input
          v-model="query.keywords"
          placeholder="昵称/用户名"
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
          label="ID"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="nickname" label="昵称"></el-table-column>
        <el-table-column prop="rolename" label="角色"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status == 1 ? 'success' : 'danger'">{{
              scope.row.status == 1 ? "启用" : "禁用"
            }}</el-tag>
          </template>
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
          :current-page="query.page"
          :page-size="query.size"
          :total="pageTotal"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="addVisible" width="30%">
      <el-form label-width="70px" :rules="rules" ref="add" :model="form">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="默认密码为123456"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="region">
          <el-select v-model="form.roleId" placeholder="请选择">
            <el-option
              v-for="r in roles"
              :key="r.id"
              :label="r.rolename"
              :value="r.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status"></el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveAdd">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px" :rules="rules" ref="add" :model="form">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="form.password"
            placeholder="不填则不修改"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="region">
          <el-select v-model="form.roleId" placeholder="请选择">
            <el-option
              v-for="r in roles"
              :key="r.id"
              :label="r.rolename"
              :value="r.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status"></el-switch>
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
import { Server } from "../api/admin";
import moment from "moment";
export default {
  name: "basetable",
  setup() {
    const roles = ref([]);
    const add = ref(null);
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
    const addVisible = ref(false);
    let form = reactive({
      id: 0,
      nickname: "",
      username: "",
      password: "",
      status: 1,
      roleId: 0,
    });
    const handleAdd = () => {
      form.id = 0;
      form.nickname = "";
      form.username = "";
      form.password = "";
      form.status = 1;
      form.roleId = "";
      addVisible.value = true;
    };
    let idx = -1;
    const rules = {
      username: [
        { required: true, message: "请输入用户名", trigger: "blur" },
        { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
      ],
      nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
    };
    const handleEdit = (index, row) => {
      idx = index;
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
      form.password = "";
      form.status = form.status ? true : false;
      form.roleId = Number(form.roleId) || "";
      editVisible.value = true;
    };
    const saveAdd = () => {
      form.status = form.status == true ? 1 : 0;
      add.value.validate((valid) => {
        console.log(valid);
        if (valid) {
          ser.add(form).then((res) => {
            if (res.code == 1000) {
              ElMessage.success(`添加成功`);
              addVisible.value = false;
              getData();
            } else {
              ElMessage.error(`添加失败:${res.message}`);
            }
          });
        }
      });
    };
    const saveEdit = () => {
      editVisible.value = false;
      form.status = form.status == true ? 1 : 0;
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
    const getRoles = () => {
      ser.getRoles().then((res) => {
        if (res.code == 1000) {
          res.data.forEach((d) => (d.id = Number(d.id)));
          roles.value = res.data;
        } else {
          ElMessage.error(`角色获取失败:${res.message}`);
        }
      });
    };
    getRoles();
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
      roles,
      addVisible,
      handleAdd,
      saveAdd,
      add,
      rules,
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
