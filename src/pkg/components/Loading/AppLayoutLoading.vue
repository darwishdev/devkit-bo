<script setup lang="ts">
// import TableLoading from '@/components/loading/TableLoading.vue';
import Skeleton from 'primevue/skeleton';
</script>

<template>
  <div class="hidden md:flex w-full absolute left-0 top-0">
    <div class="relative w-[8rem]">
      <Skeleton width="6rem" height="100vh" class="mb-2"></Skeleton>
      <div class="absolute top-[5%] mx-3 my-2">
        <Skeleton shape="circle" size="4rem"></Skeleton>
      </div>
      <div class="absolute top-[20%] mx-4">
        <Skeleton width="3rem" height="2.8rem"></Skeleton>
      </div>
      <div class="absolute top-[30%] mx-4">
        <Skeleton width="3rem" height="2.8rem"></Skeleton>
      </div>
      <div class="absolute top-[40%] mx-4">
        <Skeleton width="3rem" height="2.8rem"></Skeleton>
      </div>
      <div class="absolute top-[50%] mx-4">
        <Skeleton width="3rem" height="2.8rem"></Skeleton>
      </div>
    </div>
  </div>

  <div class="w-full md:w-[91.666667%] mx-auto absolute top-0 right-0">
    <div
      class="flex justify-between md:justify-end items-center m-5 border-2 p-4 rounded-lg"
      style="border-color: rgba(255, 255, 255, 0.05);"
    >
      <div class="flex md:hidden items-center">
        <Skeleton width="1.5rem" height="2rem" class="mx-1"></Skeleton>
        <Skeleton shape="circle" size="3rem" class="mx-1"></Skeleton>
      </div>
      <div class="flex">
        <Skeleton width="2rem" height="2rem" class="mx-1"></Skeleton>
        <Skeleton width="2rem" height="2rem" class="mx-1"></Skeleton>
        <Skeleton width="2rem" height="2rem" class="mx-1"></Skeleton>
      </div>
    </div>
  </div>

  <div class="main mt-5 mx-auto" style="width: 80%; padding-top: 10vh;">
    <!-- <TableLoading /> -->
  </div>
</template>
<style>
.p-skeleton:where([class*="my-app-dark"], [class*="my-app-dark"] *){
  background-color: var(--p-glass) !important;
}
</style>
