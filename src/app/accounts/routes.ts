export default
  [
    {
      path: '/accounts/role',
      name: 'role_list',
      meta: {
        loadingType: 'card',
        breadcrumbs: [{ label: "dashboard", icon: "chart-bar", to: { name: 'home_view' } }, { label: "Roles", icon: "single_user", to: { name: 'role_list' } }],
      },
      component: () => import('@/app/accounts/views/RoleListView.vue')
    },
    {
      path: '/accounts/role/create',
      name: 'role_create',
      meta: {
        loadingType: 'form',
        breadcrumbs: [{ label: "dashboard", icon: "chart-bar", to: { name: 'home_view' } }, { label: "role", icon: "single_user", to: { name: 'role_list' } }],
      },
      component: () => import('@/app/accounts/views/RoleCreateView.vue')
    }
  ]
