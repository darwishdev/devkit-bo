import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
export const useUiStore = defineStore(`ui`, () => {
  const isSidebarOpenedRef = ref(false)
  const sidebarStateValues = computed<{ iconName: string, className: string }>(() => isSidebarOpenedRef.value ? { iconName: 'lock', className: 'page-layout active-menu' } : { iconName: 'unlock', className: 'page-layout' })

  const toggleSidebar = () => {
    isSidebarOpenedRef.value = !isSidebarOpenedRef.value
  }
  const init = () => {
    const currentTheme : 'light' | 'dark' | null = localStorage.getItem('preferred-theme') as any
    if(!currentTheme || (currentTheme && currentTheme == 'dark')){
      document.documentElement.classList.toggle('my-app-dark')
    }
    const isSidebarOpened = localStorage.getItem('is_sidebar_opened')
    isSidebarOpenedRef.value = isSidebarOpened == 'true'
  }
  return { isSidebarOpenedRef, init, toggleSidebar, sidebarStateValues }
})
