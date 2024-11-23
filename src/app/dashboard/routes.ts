import DashboardView from './views/DashboardView.vue'
export default
  [
    {
      path: '/dashboard',
      name: 'home_view',
      meta: {
        loadingType: 'dashboard',
        breadcrumbs: [{ label: "dashboard", icon: "home", to: { name: 'home_view' } }],
      },
      component: DashboardView
    },
  ]
