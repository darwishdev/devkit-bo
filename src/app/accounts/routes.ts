export default
  [
    {
      path: '/accounts/role',
      name: 'role_list',
      meta: {
        loadingType: 'role',
        breadcrumbs: [{ label: "dashboard", icon: "home", to: { name: 'home_view' } }],
      },
      component: () => import('@/app/accounts/views/RoleListView.vue')
    },
  ]
