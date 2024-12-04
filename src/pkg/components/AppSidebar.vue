<script setup lang="ts">
import { computed, ref } from 'vue';
import AppNavigation from './AppNavigation.vue';
import AppBtn from './AppBtn.vue';
const isMenuOpened = ref(false);
const menuStateValues = computed(() => isMenuOpened.value ? { iconName: 'lock', className: 'sidebar active-menu' } : { iconName: 'unlock', className: 'sidebar' })
const toggleDesktopMenu = () => {
  isMenuOpened.value = !isMenuOpened.value
}
</script>
<template>
  <aside :class="menuStateValues.className">
    <div class="sidebar__header">
      <strong>APP LOGO</strong>
      <AppBtn @click="toggleDesktopMenu" :key="menuStateValues.iconName" :icon="menuStateValues.iconName" />
    </div>
    <AppNavigation />
  </aside>
</template>

<style>
aside.sidebar {
  position: absolute;
  left: 0;
  height: 100vh;
}

.app-layout {
  --menu-width: var(--menu-width-closed);
}

.app-layout.active-menu {
  --menu-width: var(--menu-width-opened);
}

.nav-lock {
  padding: 25px 28px 0;
}
</style>
