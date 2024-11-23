<script setup lang="ts">
import { inject } from "vue";
const dialogRef = inject("dialogRef") as any;
const close = (e: any) => {
  dialogRef.value.close(e);
};
const confirm = () => {

};
</script>
<template>
  <div class="app-dialog">
    <div class="actions">
      <button icon="check" @click="confirm" label="confirm" class="success" />
      <button icon="times" @click="close" label="canel" class="danger" />
    </div>
  </div>
</template>
