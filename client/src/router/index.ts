import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import DocumentView from '../views/DocumentView.vue';
import {useAuthStore} from "../stores/auth.store";
import AdminDashboardView from "../views/AdminDashboardView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: DashboardView },
    { path: '/document/:id', component: DocumentView },
    { path: '/admin', component: AdminDashboardView, meta: {requiresAdmin: true} },
  ]
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
    next('/');
  } else {
    next();
  }

  if (to.meta.requiresAdmin) {
    if (!authStore.isAuthenticated() || !authStore.isAdmin()) {
      return next('/');
    }
  }
});

export default router;