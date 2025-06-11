<script lang="ts" setup>
const queueStore = useQueueStore()
const { error: { value: error } } = await useAsyncData('queueStore-init', () => queueStore.initialize())

if (error) throw error
</script>

<template>
  <slot />
</template>

<style>
body {
  margin: 0;
}
</style>
