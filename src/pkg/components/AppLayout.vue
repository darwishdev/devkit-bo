<template>
  <Suspense>
    <template #default>
      <div>
        <h2>app layout goes here</h2>
        <RouterView />
      </div>
    </template>
    <template #fallback>
      <div>Loading from layoututttsss...</div>
    </template>
  </Suspense>
</template>
