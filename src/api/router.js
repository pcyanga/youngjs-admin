import Home from "../views/Home.vue";

const setRouters = (menu) => {
  const home = {
    path: "/",
    name: "Home",
    component: Home,
    children: [],
  };
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
              component: () =>
                import(`../views/${mc.key}.vue`),
            });
          }
        });
      }
    });
  }
  return home;
}
export default setRouters;

