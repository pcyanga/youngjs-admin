<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">Youngjs后台管理系统</div>
      <el-form
        :model="param"
        :rules="rules"
        ref="login"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="用户名：admin">
            <template #prepend>
              <el-button icon="el-icon-user"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="密码：123456"
            v-model="param.password"
            @keyup.enter="submitForm()"
          >
            <template #prepend>
              <el-button icon="el-icon-lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
  <div class="icp">
    {{ `© ${year} ${author} `
    }}<a href="http://beian.miit.gov.cn/" target="_blank">{{ record }}</a>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { Server } from "../api/api";
import setRouters from "../api/router";

export default {
  setup() {
    const ser = new Server();
    const router = useRouter();
    const param = reactive({});

    const rules = {
      username: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
      ],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    };
    const login = ref(null);
    const submitForm = () => {
      login.value.validate((valid) => {
        if (valid) {
          ser
            .login(param)
            .then((res) => {
              if (res.code == 1000) {
                ElMessage.success("登录成功");
                localStorage.setItem("token", res.data.token);
                ser.req("system/user/userInfo").then((res) => {
                  if (res.code == 1000) {
                    localStorage.setItem("userinfo", JSON.stringify(res.data));
                    localStorage.setItem("menu", JSON.stringify(res.data.menu));
                    localStorage.setItem(
                      "aciotnsList",
                      JSON.stringify(res.data.aciotnsList)
                    );
                    const menu = setRouters(res.data.menu);
                    router.addRoute(menu);
                    const r = getFirstMenu(res.data.menu) || "/";
                    router.push(r);
                  }
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          return false;
        }
      });
    };
    const getFirstMenu = (menu) => {
      for (let m in menu) {
        if (menu[m].type == 2) return menu[m].key;
        for (let i in menu[m].children) {
          if (menu[m].children[i].type == 2) return menu[m].children[i].key;
        }
      }
    };
    const store = useStore();
    store.commit("clearTags");
    let year = new Date().getFullYear(); // 一般都是最新的一年
    let author = "pcyang"; // 作者名
    let record = "闽ICP备16030744号</span>";
    return {
      param,
      rules,
      login,
      submitForm,
      year,
      author,
      record,
    };
  },
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  /* background-image: url(../assets/img/login-bg.jpg); */
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
.icp {
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 10px 0;
  width: 100%;
  height: 36px;
  white-space: pre;
  text-align: center;
  color: gray;
  z-index: 1000;
}
.icp > a {
  color: gray;
  text-decoration: none;
}
.icp > a:hover {
  color: aqua;
  text-decoration: none;
}
</style>