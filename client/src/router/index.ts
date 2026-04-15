import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import DocumentView from '../views/DocumentView.vue';
import {useAuthStore} from "../stores/auth.store";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: DashboardView },
    { path: '/document/:id', component: DocumentView }
  ]
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
    next('/');
  } else {
    next();
  }
});

export default router;