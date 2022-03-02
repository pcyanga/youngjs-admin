<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 菜单列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" @click="getAllMenu">刷新</el-button>
        <el-button type="primary" @click="handleAdd({ id: 0 })"
          >添加顶部菜单</el-button
        >
      </div>
      <div class="custom-tree-container">
        <div class="block"></div>
        <el-table
          ref="table"
          border
          row-key="id"
          :data="data"
          :indent="30"
          :span-method="objectSpanMethod"
        >
          <el-table-column prop="name" label="名称">
            <template v-slot="{ row }">
              <div class="cell-content">
                <span>{{ row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="key" label="地址" width="180" align="center" />
          <el-table-column prop="type" label="类型" align="center">
            <template #default="scope">
              <el-tag>{{
                scope.row.type == 1
                  ? "目录"
                  : scope.row.type == 2
                  ? "菜单"
                  : "权限"
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" align="center" />
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
                icon="el-icon-edit"
                @click="handleAdd(scope.row)"
                >添加
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
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-input v-model="form.id" type="hidden"></el-input>
        <el-form-item label="菜单名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="form.key"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="form.sort"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="form.type">
            <el-radio label="1">目录</el-radio>
            <el-radio label="2">菜单</el-radio>
            <el-radio label="3">权限</el-radio>
          </el-radio-group>
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
    <el-dialog title="添加" v-model="addVisible" width="30%">
      <el-form label-width="70px" :model="form">
        <el-input v-model="form.pid" type="hidden"></el-input>
        <el-input v-model="form.id" type="hidden"></el-input>
        <el-form-item label="菜单名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="form.key"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="form.sort" type="number"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="1">目录</el-radio>
            <el-radio :label="2">菜单</el-radio>
            <el-radio :label="3">权限</el-radio>
          </el-radio-group>
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
import { Server } from "../api/menu";
export default {
  name: "basetable",
  setup() {
    const ser = new Server();
    // 删除操作
    const handleDelete = (data) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          ser.delete({ ids: data.id }).then((res) => {
            if (res.code == 1000) {
              ElMessage.success(`删除成功`);
              getAllMenu();
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
      pid: 0,
      type: 1,
      label: "",
      name: "",
      sort: 0,
      key: "",
    });
    const handleEdit = (row) => {
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
      form.label = form.name;
      editVisible.value = true;
    };
    const saveEdit = () => {
      ser.update(form).then((res) => {
        if (res.code == 1000) {
          ElMessage.success(`修改成功`);
          editVisible.value = false;
          getAllMenu();
        } else {
          ElMessage.error(`修改失败:${res.message}`);
        }
      });
    };
    const addVisible = ref(false);
    const handleAdd = (data) => {
      getAllMenu();
      form.id = 0;
      form.pid = data.id;
      form.name = "";
      form.key = "";
      form.sort = "";
      form.type = 1;
      addVisible.value = true;
    };
    const saveAdd = () => {
      ser.add(form).then((res) => {
        if (res.code == 1000) {
          ElMessage.success(`添加成功`);
          addVisible.value = false;
          getAllMenu();
        } else {
          ElMessage.error(`添加失败:${res.message}`);
        }
      });
    };
    const data = ref([]);
    const getAllMenu = () => {
      ser.getAllMenu().then((res) => {
        if (res.code == 1000) {
          data.value = res.data;
        } else {
          ElMessage.error(`菜单获取失败:${res.message}`);
        }
      });
    };
    getAllMenu();
    return {
      editVisible,
      form,
      handleDelete,
      handleEdit,
      saveEdit,
      addVisible,
      handleAdd,
      saveAdd,
      data,
      getAllMenu,
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
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.cell-content {
  display: inline-block;
}
</style>
