import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        meta: {
          title: "系统首页",
        },
        component: () =>
          import(/* webpackChunkName: "dashboard" */ "../views/Dashboard.vue"),
      },
      {
        path: "/table",
        name: "basetable",
        meta: {
          title: "表格",
        },
        component: () =>
          import(/* webpackChunkName: "table" */ "../views/BaseTable.vue"),
      },
      {
        path: "/charts",
        name: "basecharts",
        meta: {
          title: "图表",
        },
        component: () =>
          import(/* webpackChunkName: "charts" */ "../views/BaseCharts.vue"),
      },
      {
        path: "/form",
        name: "baseform",
        meta: {
          title: "表单",
        },
        component: () =>
          import(/* webpackChunkName: "form" */ "../views/BaseForm.vue"),
      },
      {
        path: "/tabs",
        name: "tabs",
        meta: {
          title: "tab标签",
        },
        component: () =>
          import(/* webpackChunkName: "tabs" */ "../views/Tabs.vue"),
      },
      {
        path: "/donate",
        name: "donate",
        meta: {
          title: "鼓励作者",
        },
        component: () =>
          import(/* webpackChunkName: "donate" */ "../views/Donate.vue"),
      },
      {
        path: "/permission",
        name: "permission",
        meta: {
          title: "权限管理",
          permission: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "permission" */ "../views/Permission.vue"
          ),
      },
      {
        path: "/i18n",
        name: "i18n",
        meta: {
          title: "国际化语言",
        },
        component: () =>
          import(/* webpackChunkName: "i18n" */ "../views/I18n.vue"),
      },
      {
        path: "/upload",
        name: "upload",
        meta: {
          title: "上传插件",
        },
        component: () =>
          import(/* webpackChunkName: "upload" */ "../views/Upload.vue"),
      },
      {
        path: "/icon",
        name: "icon",
        meta: {
          title: "自定义图标",
        },
        component: () =>
          import(/* webpackChunkName: "icon" */ "../views/Icon.vue"),
      },
      {
        path: "/404",
        name: "404",
        meta: {
          title: "找不到页面",
        },
        component: () =>
          import(/* webpackChunkName: "404" */ "../views/404.vue"),
      },
      {
        path: "/403",
        name: "403",
        meta: {
          title: "没有权限",
        },
        component: () =>
          import(/* webpackChunkName: "403" */ "../views/403.vue"),
      },
      {
        path: "/user",
        name: "user",
        meta: {
          title: "个人中心",
        },
        component: () =>
          import(/* webpackChunkName: "user" */ "../views/User.vue"),
      },
      {
        path: "/member",
        name: "member",
        meta: {
          title: "会员管理",
        },
        component: () =>
          import(/* webpackChunkName: "table" */ "../views/member.vue"),
      },
      {
        path: "/rate",
        name: "rate",
        meta: {
          title: "比例设置",
        },
        component: () =>
          import(/* webpackChunkName: "table" */ "../views/rate.vue"),
      },
      {
        path: "/recharge",
        name: "recharge",
        meta: {
          title: "充值列表",
        },
        component: () =>
          import(/* webpackChunkName: "table" */ "../views/recharge.vue"),
      },
      {
        path: "/withdraw",
        name: "withdraw",
        meta: {
          title: "提现列表",
        },
        component: () =>
          import(/* webpackChunkName: "table" */ "../views/withdraw.vue"),
      },
      {
        path: "/profit",
        name: "profit",
        meta: {
          title: "财务明细",
        },
        component: () =>
          import(/* webpackChunkName: "table" */ "../views/profit.vue"),
      },
      {
        path: "/account",
        name: "account",
        meta: {
          title: "TRX账号",
        },
        component: () =>
          import(/* webpackChunkName: "table" */ "../views/account.vue"),
      },
      {
        path: "/notice",
        name: "notice",
        meta: {
          title: "通告设置",
        },
        component: () =>
          import(/* webpackChunkName: "table" */ "../views/notice.vue"),
      },
      {
        path: "/param",
        name: "param",
        meta: {
          title: "参数设置",
        },
        component: () =>
          import(/* webpackChunkName: "table" */ "../views/param.vue"),
      },
      {
        path: "/user",
        name: "user",
        meta: {
          title: "用户列表",
        },
        component: () =>
          import(/* webpackChunkName: "table" */ "../views/admin.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登录",
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title}`;
  const role = localStorage.getItem("ms_username");
  if (!role && to.path !== "/login") {
    next("/login");
  } else if (to.meta.permission) {
    // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
    role === "admin" ? next() : next("/403");
  } else {
    next();
  }
});

export default router;
