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
        <el-button type="primary" @click="getAllMenu" size="mini"
          >刷新</el-button
        >
        <el-button type="primary" @click="handleAdd({ id: 0 })" size="mini"
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
          size="mini"
        >
          <el-table-column prop="name" label="名称">
            <template v-slot="{ row }">
              <div class="cell-content">
                <span>{{ row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="key" label="地址" align="center" />
          <el-table-column prop="icon" label="图标" align="center">
            <template #default="scope1">
              <i :class="`el-icon-lx-${scope1.row.icon}`"></i>
            </template>
          </el-table-column>
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
          <el-table-column label="操作" width="300" align="center">
            <template #default="scope">
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
                size="mini"
                >编辑
              </el-button>
              <el-button
                type="text"
                icon="el-icon-plus"
                @click="handleAdd(scope.row)"
                size="mini"
                >添加
              </el-button>
              <el-button
                type="text"
                icon="el-icon-delete"
                class="red"
                @click="handleDelete(scope.row)"
                size="mini"
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
        <el-form-item label="权限组">
          <el-cascader
            v-model="form.actions"
            :options="options"
            :props="props"
            collapse-tags
            clearable
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="图标">
          <el-input
            v-model="form.icon"
            @click="iconPanelShow"
            clearable
          ></el-input>
          <ul v-if="iconVisible" @blur="iconPanelHidden">
            <li
              class="icon-li"
              v-for="(item, index) in iconList"
              :key="index"
              @click="iconClick(item)"
            >
              <div class="icon-li-content">
                <i :class="`el-icon-lx-${item}`"></i>
              </div>
            </li>
          </ul>
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
    <el-dialog title="添加" v-model="addVisible" width="50%">
      <el-form label-width="70px" :model="form">
        <el-input v-model="form.pid" type="hidden"></el-input>
        <el-input v-model="form.id" type="hidden"></el-input>
        <el-form-item label="菜单名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="路径">
          <el-input
            v-model="form.key"
            placeholder="文件路径及访问路径一致"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限组">
          <el-cascader
            v-model="form.actions"
            :options="options"
            :props="props"
            collapse-tags
            clearable
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="图标">
          <el-input
            v-model="form.icon"
            @click="iconPanelShow"
            clearable
          ></el-input>
          <ul v-if="iconVisible" @blur="iconPanelHidden">
            <li
              class="icon-li"
              v-for="(item, index) in iconList"
              :key="index"
              @click="iconClick(item)"
            >
              <div class="icon-li-content">
                <i :class="`el-icon-lx-${item}`"></i>
              </div>
            </li>
          </ul>
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
import { Server } from "../api/api";
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
          ser.req("system/menu/delete", { ids: data.id }).then((res) => {
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
      name: "",
      sort: 0,
      key: "",
      icon: "",
      actions: [],
    });
    const handleEdit = (row) => {
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
      const actionsList = [];

      if (form.actions) {
        const actions = form.actions.split(";");
        actions.forEach((a) => {
          const ac = a.split("/");
          actionsList.push(ac);
        });
      }
      form.actions = actionsList;
      editVisible.value = true;
    };
    const saveEdit = () => {
      const actions = [];
      form.actions.forEach((a) => {
        const ac = a.join("/");
        actions.push(ac);
      });
      form.actions = actions.join(";");
      ser.req("system/menu/update", form).then((res) => {
        if (res.code == 1000) {
          ElMessage.success(`修改成功`);
          editVisible.value = false;
          getAllMenu();
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
      form.sort = 0;
      form.type = 1;
      form.actions = [];
      addVisible.value = true;
    };
    const saveAdd = () => {
      const actions = [];
      form.actions.forEach((a) => {
        const ac = a.join("/");
        actions.push(ac);
      });
      form.actions = actions.join(";");
      ser.req("system/menu/add", form).then((res) => {
        if (res.code == 1000) {
          ElMessage.success(`添加成功`);
          addVisible.value = false;
          getAllMenu();
        }
      });
    };
    const data = ref([]);
    const getAllMenu = () => {
      ser.req("system/menu/list").then((res) => {
        if (res.code == 1000) {
          data.value = res.data;
        } else {
          ElMessage.error(`菜单获取失败:${res.message}`);
        }
      });
    };
    getAllMenu();
    const iconVisible = ref(false);
    const iconList = [
      "attentionforbidfill",
      "attentionfill",
      "tagfill",
      "peoplefill",
      "noticefill",
      "mobilefill",
      "voicefill",
      "unlock",
      "lock",
      "home",
      "homefill",
      "deletefill",
      "notificationfill",
      "notificationforbidfill",
      "likefill",
      "commentfill",
      "camerafill",
      "warnfill",
      "timefill",
      "locationfill",
      "favorfill",
      "skinfill",
      "newsfill",
      "recordfill",
      "emojifill",
      "messagefill",
      "goodsfill",
      "crownfill",
      "move",
      "add",
      "hotfill",
      "servicefill",
      "presentfill",
      "picfill",
      "rankfill",
      "male",
      "female",
      "down",
      "top",
      "rechargefill",
      "forwardfill",
      "infofill",
      "redpacket_fill",
      "roundaddfill",
      "friendaddfill",
      "cartfill",
      "more",
      "moreandroid",
      "back",
      "right",
      "shopfill",
      "questionfill",
      "roundclosefill",
      "roundcheckfill",
      "global",
      "mail",
      "punch",
      "exit",
      "upload",
      "read",
      "file",
      "link",
      "full",
      "group",
      "friend",
      "profile",
      "addressbook",
      "calendar",
      "text",
      "copy",
      "share",
      "wifi",
      "vipcard",
      "weibo",
      "remind",
      "refresh",
      "filter",
      "settings",
      "scan",
      "qrcode",
      "cascades",
      "apps",
      "sort",
      "searchlist",
      "search",
      "edit",
    ];
    function iconPanelShow() {
      iconVisible.value = true;
    }
    function iconPanelHidden() {
      iconVisible.value = false;
    }
    function iconClick(icon) {
      form.icon = icon;
      iconVisible.value = false;
    }
    function isClickEL(el) {
      console.log(el);
      if (!isIE() || !el) return false;
      var coords = getCoords(el);
      var elTop = coords.top;
      var elBottom = 0;
      var elLeft = coords.left;
      var elRight = 0;
      var elHeight = el.offsetHeight;
      var elWidth = el.offsetWidth;
      elBottom = elTop + elHeight;
      elRight = elLeft + elWidth;

      var ev = window.event;
      if (!ev) return false;
      var mouseX = ev.clientX;
      var mouseY = ev.clientY;

      var isInTheWidth = mouseX >= elLeft && mouseX <= elRight;
      var isInTheHeight = mouseY >= elTop && mouseY <= elBottom;
      console.log(isInTheWidth && isInTheHeight);
      return isInTheWidth && isInTheHeight;
    }

    var getCoords = function (el) {
      var box = el.getBoundingClientRect(),
        isQuirk = document.documentMode
          ? document.documentMode == 5
            ? true
            : false
          : document.compatMode == "CSS1Compat"
          ? false
          : true,
        doc = el.ownerDocument,
        body = doc.body,
        html = doc.documentElement,
        clientTop = html.clientTop || body.clientTop || 0,
        clientLeft = html.clientLeft || body.clientLeft || 0,
        top =
          box.top +
          (self.pageYOffset || (!isQuirk && html.scrollTop) || body.scrollTop) -
          clientTop,
        left =
          box.left +
          (self.pageXOffset ||
            (!isQuirk && html.scrollLeft) ||
            body.scrollLeft) -
          clientLeft;
      return { top: top, left: left };
    };
    const options = ref([]);
    const getRouters = () => {
      ser.req("system/menu/getRouters").then((res) => {
        if (res.code == 1000) {
          options.value = res.data;
        }
      });
    };
    getRouters();
    const props = { multiple: true };
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
      iconVisible,
      iconList,
      iconPanelShow,
      iconPanelHidden,
      iconClick,
      isClickEL,
      options,
      props,
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
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10px;
  padding-right: 8px;
}
.cell-content {
  display: inline-block;
}
ul,
li {
  list-style: none;
}
.icon-li {
  display: inline-block;
  padding: 10px;
  width: 30px;
  height: 30px;
}
.icon-li-content {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.icon-li-content i {
  font-size: 15px;
  color: #606266;
}
.icon-li-content span {
  margin-top: 10px;
  color: #787878;
}
</style>
