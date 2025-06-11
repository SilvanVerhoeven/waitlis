<script setup lang="ts">
import { StepForwardOutlined } from '#components'

defineProps<{
  disabled?: boolean
}>()

const queueStore = useQueueStore()
</script>

<template>
  <BigButton
    type="primary"
    :action="queueStore.callNext"
    :disabled="disabled"
    :icon="StepForwardOutlined"
    label="Nächste Person"
  />
</template>
