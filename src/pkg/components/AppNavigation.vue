<script setup lang="ts">
import { RouterLink } from 'vue-router';
import PanelMenu from 'primevue/panelmenu';
import type { NavigationBarItem } from '@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_auth_pb';
import { ref } from 'vue';
import AppIcon from './AppIcon.vue';
import AppBtn from './AppBtn.vue';

const isMenuOpened = ref(false);
const toggleDesktopMenu = () => {
  isMenuOpened.value = !isMenuOpened.value
}
const navigationBar: NavigationBarItem[] = JSON.parse(localStorage.getItem("navigation_bar")!)
// const navigationBar: any[] = [
//     {
//         navigationBarItemId: 1,
//         parentId: 0,
//         key: "dashboard",
//         label: "Dashboard",
//         labelAr: "لوحة القيادة",
//         icon: "dashboard-icon",
//         route: "/dashboard",
//         level: 1,
//         items: [
//             {
//                 navigationBarItemId: 2,
//                 parentId: 1,
//                 key: "analytics",
//                 label: "Analytics",
//                 labelAr: "تحليلات",
//                 icon: "analytics-icon",
//                 route: "/dashboard/analytics",
//                 level: 2,
//                 items: [],
//             },
//             {
//                 navigationBarItemId: 3,
//                 parentId: 1,
//                 key: "reports",
//                 label: "Reports",
//                 labelAr: "تقارير",
//                 icon: "reports-icon",
//                 route: "/dashboard/reports",
//                 level: 2,
//                 items: [],
//             }
//         ]
//     },
//     {
//         navigationBarItemId: 4,
//         parentId: 0,
//         key: "settings",
//         label: "Settings",
//         labelAr: "إعدادات",
//         icon: "settings-icon",
//         route: "/settings",
//         level: 1,
//         items: [
//             {
//                 navigationBarItemId: 5,
//                 parentId: 4,
//                 key: "profile",
//                 label: "Profile",
//                 labelAr: "ملف تعريفي",
//                 icon: "profile-icon",
//                 route: "/settings/profile",
//                 level: 2,
//                 items: []
//             },
//             {
//                 navigationBarItemId: 6,
//                 parentId: 4,
//                 key: "preferences",
//                 label: "Preferences",
//                 labelAr: "تفضيلات",
//                 icon: "preferences-icon",
//                 route: "/settings/preferences",
//                 level: 2,
//                 items: []
//             }
//         ]
//     }
// ];
</script>
<template>
  <div class="app-layout" :class="{'active-menu' : isMenuOpened}">
    <aside class="desktop-menu">
          <div class="w-full nav-lock">
            <AppBtn v-if="isMenuOpened" @click="toggleDesktopMenu" icon="lock" />
            <AppBtn v-else @click="toggleDesktopMenu" icon="unlock" />
          </div>
          <PanelMenu :model="navigationBar">
            <template #item="{ item }">
              <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a class="w-full flex items-center cursor-pointer text-surface-700 dark:text-surface-0 px-4 py-2" :href="href"
                  @click="navigate">
                  <AppIcon color="text-primary mr-3" v-if="item.icon" :icon="item.icon" />
                  <span class="ml-2 hidden">{{ item.label }}</span>
                </a>
              </router-link>
              <a v-else class="w-full flex items-center justify-between cursor-pointer text-surface-700 dark:text-surface-0 px-4 py-2" :href="item.url"
                :target="item.target">
                <div class="flex items-center">
                  <AppIcon color="text-primary mr-3" v-if="item.icon" :icon="item.icon" />
                  <span class="ml-2 hidden">{{ item.label }}</span>
                </div>
                <span v-if="item.items" class="pi pi-angle-down text-primary ml-2" />
              </a>
            </template>
          </PanelMenu>
    </aside>
  </div>
</template>

<style>
.app-layout{
  --menu-width: var(--menu-width-closed);
}
.app-layout.active-menu{
    --menu-width: var(--menu-width-opened);
}

.nav-lock{
  padding: 25px 28px 0;
}
</style>
