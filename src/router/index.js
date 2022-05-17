import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "login"//重定向到login(实现登录进来就是login路径)
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import( "../views/Login/index.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
