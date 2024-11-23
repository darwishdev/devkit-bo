<script setup lang="ts">
import { RouterLink } from 'vue-router';
import PanelMenu from 'primevue/panelmenu';
import type { NavigationBarItem } from '@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_auth_pb';

const navigationBar: NavigationBarItem[] = JSON.parse(localStorage.getItem("navigation_bar")!)
</script>
<template>
  <h2>menue here</h2>

  <PanelMenu :model="navigationBar">
    <template #item="{ item }">
      <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
        <a v-ripple class="flex items-center cursor-pointer text-surface-700 dark:text-surface-0 px-4 py-2" :href="href"
          @click="navigate">
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </router-link>
      <a v-else v-ripple class="flex items-center cursor-pointer text-surface-700 dark:text-surface-0 px-4 py-2"
        :href="item.url" :target="item.target">
        <span :class="item.icon" />
        <span class="ml-2">{{ item.label }}</span>
        <span v-if="item.items" class="pi pi-angle-down text-primary ml-auto" />
      </a>
    </template>
  </PanelMenu>
</template>
