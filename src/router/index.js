import { createRouter, createWebHashHistory } from "vue-router";
import setRouters from "../api/router";
const routes = [
  {
    path: "/login",
    name: "login",
    meta: {
      title: "登录",
    },
    component: () => import("../views/login.vue"),
  },
];
let menu = localStorage.getItem("menu");
menu = JSON.parse(menu);
const home = setRouters(menu);
routes.push(home);
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title}`;
  const token = localStorage.getItem("token");
  if (!token && to.path !== "/login") {
    next("/login");
  } else if (to.meta.permission) {
    // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
    role === "admin" ? next() : next("/403");
  } else {
    next();
  }
});
export default router;
