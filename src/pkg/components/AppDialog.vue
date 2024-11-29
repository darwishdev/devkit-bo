<script setup lang="ts">
import { inject } from "vue";
import AppBtn from "./AppBtn.vue";
const dialogRef = inject("dialogRef") as any;
const emit = defineEmits(["confirmed"]);
const close = (e: any) => {
  dialogRef.value.close(e);
};
const confirm = () => {
  console.log("confirimed")
  emit("confirmed", dialogRef.value);
};
</script>
<template>
  <div class="app-dialog">
    <slot />
    <div class="actions">
      <AppBtn icon="health_check" @click="confirm" label="confirm" class="success" />
      <AppBtn icon="close" @click="close" label="canel" class="danger" />
    </div>
  </div>
</template>
