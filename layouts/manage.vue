<script lang="ts" setup>
const queueStore = useQueueStore()
const phaseStore = usePhaseStore()
const { error: errorQueue } = await useAsyncData('queueStore-init', () => queueStore.initialize())
const { error: errorPhase } = await useAsyncData('phaseStore-init', () => phaseStore.initialize())

const error = errorQueue.value || errorPhase.value

if (error) {
  await navigateTo('/')
  throw error
}
</script>

<template>
  <slot />
</template>

<style>
body {
  margin: 0;
}
</style>
