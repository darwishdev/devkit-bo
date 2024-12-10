<script setup lang="ts">
// import TableLoading from '@/components/loading/TableLoading.vue';
import Skeleton from 'primevue/skeleton';
</script>
<template>
    <div class="hidden md:flex w-full absolute left-0 top-0">
        <div class="relative w-8rem">
            <Skeleton width="6rem" height="100vh" class="mb-2"></Skeleton>
            <div class="my-2 absolute m-auto top-0 mx-3" style="top : 5%;">
                <Skeleton shape="circle" size="4rem"></Skeleton>
            </div>
            <div class="absolute m-auto" style="top: 20%;">
                <Skeleton width="3rem" height="2.8rem" class="mx-4"></Skeleton>
            </div>
            <div class="absolute m-auto" style="top: 30%;">
                <Skeleton width="3rem" height="2.8rem" class="mx-4"></Skeleton>
            </div>
            <div class="absolute m-auto" style="top: 40%;">
                <Skeleton width="3rem" height="2.8rem" class="mx-4"></Skeleton>
            </div>
            <div class="absolute m-auto" style="top: 50%;">
                <Skeleton width="3rem" height="2.8rem" class="mx-4"></Skeleton>
            </div>
        </div>
    </div>
    <div class="w-full md:w-11 m-auto absolute top-0 right-0">
        <div class="flex justify-content-between md:justify-content-end align-items-center m-5 border-2 p-4 border-round"
            style="border-color: rgba(255, 255, 255, 0.05);">
            <div class="flex md:hidden align-items-center">
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
    <div class="main mt-5 m-auto" style="width : 80%; padding-top: 10vh;">
        <!-- <TableLoading /> -->
    </div>
</template>
