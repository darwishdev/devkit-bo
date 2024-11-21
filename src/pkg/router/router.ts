
import { createRouter, createWebHistory, type RouteLocationNormalized, type NavigationGuardNext } from 'vue-router'
import AppLayout from '../../pkg/components/AppLayout.vue';
import dashboardRoutes from '../../app/dashboard/routes';
import LoginView from '../../app/auth/views/LoginView.vue'
import { apiClient } from '../api/ApiClient';
// import inventoryRoutes from '@/app/inventory/routes';

const appRoutes = [
  ...dashboardRoutes,
  // ...inventoryRoutes,
]
const guestMiddleWare = async (_: RouteLocationNormalized, __: RouteLocationNormalized, next: NavigationGuardNext) => {
  try {
    await apiClient.authAuthorize({})
    next("/dashboard")
    return false
  } catch (e: any) {
    next()
    return true
  }
}

const authMiddleWare = async (_: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  if (from.name != "login") {
    try {
      await apiClient.authAuthorize({})
      next()
      return true
    } catch (e: any) {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('sidebar')
      localStorage.removeItem('roles')
      next('/login')
      return false
    }
  }
  next()
}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      redirect: '/dashboard',
      beforeEnter: authMiddleWare,
      children: appRoutes
    },
    {
      path: '/login',
      component: LoginView,
      beforeEnter: guestMiddleWare,

    }
  ]
})

export default router
