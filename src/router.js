import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import auth from "./utils/auth";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      beforeEnter: (to, from, next) => {
        // ログイン中なら"/login"から"/home"へリダイレクト
        auth.isLoggedIn().then(isLoggedIn => {
          if (to.path == "/login" && isLoggedIn) {
            next({
              path: "/"
            });
          } else {
            next();
          }
        });
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // このルートはログインされているかどうか認証が必要です。
    // もしされていないならば、ログインページにリダイレクトします。
    auth.isLoggedIn().then(isLoggedIn => {
      if (!isLoggedIn) {
        next({
          path: "/login"
        });
      } else {
        next();
      }
    });
  } else {
    next();
  }
});

export default router;
