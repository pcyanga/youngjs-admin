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
      </div>
      <div class="custom-tree-container">
        <div class="block">
          <el-button type="primary" @click="handleAdd({ id: 0 })" size="mini"
            >添加顶部菜单</el-button
          >
          <el-tree
            :data="data"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
          >
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span>
                  <el-button size="mini" type="text" @click="handleAdd(data)">
                    添加
                  </el-button>
                  <el-button size="mini" type="text" @click="handleEdit(data)">
                    编辑
                  </el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="handleDelete(data)"
                  >
                    删除
                  </el-button>
                </span>
              </span>
            </template>
          </el-tree>
        </div>
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
      <el-form label-width="70px">
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
      type: 0,
      label: "",
      name: "",
      sort: 0,
      key: "",
    });
    const handleEdit = (row) => {
      console.log(row);
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
      form.label = form.name;
      editVisible.value = true;
    };
    const tree = ref();
    const saveEdit = () => {
      delete form.label;
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
    const check = ref([]);
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
    const defaultProps = {
      children: "children",
      label: "label",
    };
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
      defaultProps,
      check,
      tree,
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
</style>
