<script lang="ts" setup>
const sseStore = useSSEStore()
const queueStore = useQueueStore()
const phaseStore = usePhaseStore()
const { error: errorSSE } = await useAsyncData('sseStore-init', () => sseStore.initialize())
const { error: errorQueue } = await useAsyncData('queueStore-init', () => queueStore.initialize())
const { error: errorPhase } = await useAsyncData('phaseStore-init', () => phaseStore.initialize())

onUnmounted(() => {
  sseStore.teardown()
  queueStore.teardown()
})

const error = errorSSE.value || errorQueue.value || errorPhase.value

if (error) {
  if (!errorSSE.value) await navigateTo('/')
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
