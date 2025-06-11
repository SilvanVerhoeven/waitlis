<script lang="ts" setup>
const queueStore = useQueueStore()
const phaseStore = usePhaseStore()
await useAsyncData('queueStore-init', () => queueStore.initialize())
await useAsyncData('phaseStore-init', () => phaseStore.initialize())
</script>

<template>
  <NuxtPage />
</template>

<style>
body {
  margin: 0;
}
</style>
