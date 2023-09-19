import Home from "../views/Home.vue";

const setRouters = (menu) => {
  const home = {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/",
        name: "index",
        meta: {
          title: "首页",
        },
        component: () => import("../views/donate.vue"),
      },
    ],
  };
  home.children.push({
    path: "/user",
    name: "user",
    meta: {
      title: "个人中心",
    },
    component: () => import("../views/user.vue"),
  });
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
  }
  return home;
};
export default setRouters;
