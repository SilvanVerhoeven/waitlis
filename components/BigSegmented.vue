<script setup lang="ts">
const props = defineProps<{
  options: { value: string, icon: Component, label: string }[]
  value: string
  onChange: () => void | Promise<void>
  ready?: boolean
}>()
const isChanging = ref(false)

const handleChange = async () => {
  isChanging.value = true
  await props.onChange()
  isChanging.value = false
}

const options = ref(props.options.map(option => ({ value: option.value, payload: { icon: option.icon, title: option.label } })))
</script>

<template>
  <a-segmented
    class="big-custom-segmented"
    size="large"
    :disabled="props.ready === false || isChanging"
    :options="options"
    :value="props.value"
    @change="handleChange"
  >
    <template #label="{ payload }">
      <div style="padding: 4.4px 2px">
        <component :is="payload.icon" />
        <div>
          {{ payload.title }}
        </div>
      </div>
    </template>
  </a-segmented>
</template>

<style lang="css" scoped>
.big-custom-segmented :deep(.ant-segmented-item-label) {
  line-height: inherit !important;
}
</style>
