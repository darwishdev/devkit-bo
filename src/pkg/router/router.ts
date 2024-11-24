
import { createRouter, createWebHistory, type RouteLocationNormalized, type NavigationGuardNext } from 'vue-router'
import AppLayout from '../../pkg/components/AppLayout.vue';
import dashboardRoutes from '../../app/dashboard/routes';
import LoginView from '../../app/auth/views/LoginView.vue'

const appRoutes = [
  ...dashboardRoutes,
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      redirect: '/dashboard',
      children: appRoutes
    },
    {
      path: '/login',
      component: LoginView,
    }
  ]
})

export default router
