import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/login",
    name: "login",
    meta: {
      title: "登录",
    },
    component: () => import("../views/login.vue"),
  },
];
const home = {
  path: "/",
  name: "Home",
  component: Home,
  children: [],
};
let menu = localStorage.getItem("menu");
menu = JSON.parse(menu);
if (menu && menu.length) {
  menu.forEach((m) => {
    if (m.key) {
      home.children.push({
        path: m.key,
        name: m.key,
        meta: {
          title: m.name,
        },
        component: () => import(`../views/${m.key}.vue`),
      });
    }
    if (m.children) {
      m.children.forEach((mc) => {
        if (mc.key) {
          home.children.push({
            path: mc.key,
            name: mc.key,
            meta: {
              title: mc.name,
            },
            component: () => import(`../views/${mc.key}.vue`),
          });
        }
      });
    }
  });
  routes.push(home);
}
console.log(routes);
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title}`;
  const role = localStorage.getItem("username");
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
