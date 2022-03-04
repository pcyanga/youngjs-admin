<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 代理列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" @click="handleSearch">刷新</el-button>
        <el-button type="primary" @click="handleAdd">添加</el-button>
        <el-input
          v-model="query.keywords"
          placeholder="名称/代号"
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
        <el-table-column prop="name" label="代理名称"></el-table-column>
        <el-table-column prop="code" label="代号"></el-table-column>
        <el-table-column prop="link" label="链接">
          <template #default="scope">
            {{ scope.row.link }}
            <i
              class="el-icon-document-copy"
              style="margin-left: 10px; cursor: pointer"
              :data-clipboard-text="scope.row.link"
              @click="copy"
            ></i
          ></template>
        </el-table-column>
        <el-table-column prop="userNumber" label="会员人数"></el-table-column>
        <el-table-column prop="recharge" label="总充值"></el-table-column>
        <el-table-column prop="withdraw" label="总提现"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
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
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.row)"
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
    <el-dialog title="添加" v-model="addVisible" width="30%">
      <el-form label-width="70px" :rules="rules" ref="add" :model="form">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="代号" prop="code">
          <el-input v-model="form.code" placeholder="例：code"></el-input>
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
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="代号" prop="code">
          <el-input
            v-model="form.code"
            placeholder="例：code"
            disabled
          ></el-input>
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
import { Server } from "../api/agent";
import moment from "moment";
import Clipboard from "clipboard";
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
    const handleDelete = (rows) => {
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
      name: "",
      code: "",
    });
    const handleAdd = () => {
      form.id = 0;
      form.name = "";
      form.code = "";
      addVisible.value = true;
    };
    const rules = {
      name: [
        { required: true, message: "请输入名称", trigger: "blur" },
        { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" },
      ],
      code: [
        { required: true, message: "请输入代号", trigger: "blur" },
        { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
      ],
    };
    const handleEdit = (row) => {
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
      editVisible.value = true;
    };
    const saveAdd = () => {
      add.value.validate((valid) => {
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
      ser.update(form).then((res) => {
        if (res.code == 1000) {
          ElMessage.success(`修改成功`);
          getData();
        } else {
          ElMessage.error(`修改失败:${res.message}`);
        }
      });
    };
    const copy = () => {
      var clipboard = new Clipboard(".el-icon-document-copy");
      clipboard.on("success", (e) => {
        ElMessage.success(`复制成功`);
        //  释放内存
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        ElMessage.error(`复制失败:${e.message}`);
        // 释放内存
        clipboard.destroy();
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
      addVisible,
      handleAdd,
      saveAdd,
      add,
      rules,
      copy,
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
