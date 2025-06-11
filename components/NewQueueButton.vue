<script setup lang="ts">
import { PlusOutlined } from '#components'

const isCreating = ref(false)
const queueStore = useQueueStore()

const handleQueueCreation = async () => {
  isCreating.value = true
  await queueStore.createQueue()
  isCreating.value = false
}
</script>

<template>
  <BigButton
    :icon="PlusOutlined"
    label="Hinzufügen"
    :action="handleQueueCreation"
    :loading="isCreating"
  />
</template>
