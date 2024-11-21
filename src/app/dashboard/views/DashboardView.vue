<script setup lang="ts">
import { apiClient } from "@/pkg/api/ApiClient"
import { useQuery } from '@tanstack/vue-query'

const request = indexedDB.open('devkit_db');

request.onsuccess = function (event: any) {
  const db = event.target.result; // Get the database instance

  // Start a transaction
  const transaction = db.transaction('queryCache', 'readonly');
  const objectStore = transaction.objectStore('queryCache');

  // G:w
  // et the first record using a cursor
  const cursorRequest = objectStore.openCursor();

  cursorRequest.onsuccess = function (event: any) {
    const cursor = event.target.result;
    if (cursor) {
      console.log('First Record:', cursor.value); // Log the first record
    } else {
      console.log('No records found.');
    }
  };

  cursorRequest.onerror = function (event: any) {
    console.error('Error retrieving data:', event.target.error);
  };
};
const fetchT = async () => {
  return new Promise((resolve) => {

    const func = apiClient.translationList

    apiClient.translationList({}).then((resp) => {
      setTimeout(() => resolve(resp)
        , 5000)
    })
  })
}
//await fetchT()
console.log('TanStack Query is ready:',)
const { data, suspense } = useQuery({
  queryKey: ['todos'],
  suspense: true,
  queryFn: async () => apiClient.translationList({}),
})
await suspense()
</script>
<template>
  {{ data }}

</template>
