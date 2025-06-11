<script setup lang="ts">
const { queues, open } = defineProps<{
  open: boolean
  queues: Queue[]
}>()

const isLoading = ref(false)
const selectedQueue = ref<Queue | undefined>()
// const router = useRouter()

const handleSubmit = async () => {
  if (!selectedQueue.value) return
  isLoading.value = true
  // await enqueue(selectedQueue)
  // router.refresh()
  isLoading.value = false
}
</script>

<template>
  <a-card
    title="Redeliste wählen"
  >
    <template #actions>
      <a-row key="enqueue" style="padding: 0 12px">
        <a-col :span="24">
          <a-button
            type="primary"
            :disabled="selectedQueue === undefined || !open"
            block
            size="large"
            :loading="isLoading"
            @click="handleSubmit"
          >
            {{ open ? 'Redebeitrag anmelden' : 'Redelisten sind geschlossen' }}
          </a-button>
        </a-col>
      </a-row>
    </template>
    <a-list
      style="width: 300px"
      :data-source="queues"
    >
      <template #renderItem="{ item: queue }">
        <a-list-item
          class="queue-item"
          :class="queue.id === selectedQueue?.id && 'selected'"
          @click="() => selectedQueue = queue"
        >
          <a-radio
            :checked="queue.id === selectedQueue?.id"
            @change="selectedQueue = queue"
          >
            <a-typography>{{ queue.name }}</a-typography>
          </a-radio>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>

<style scoped>
.queue-item {
  display: flex;
  align-items: start;
  background-color: transparent;
  border-color: transparent;
  border-width: 2px;
  border-style: solid;
  cursor: pointer;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 5px;
}

.queue-item.selected {
  background-color: #e6f7ff;
  border-color: #1890ff;
}

/* Counteracts border-block-end styling by Antd - without it the last item would miss the bottom border */

.queue-item:last-of-type {
  border-block-end: 2px solid transparent;
}

.queue-item.selected:last-of-type {
  border-block-end-color: #1890ff;
}
</style>
