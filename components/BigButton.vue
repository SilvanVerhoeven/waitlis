<script lang="ts" setup>
import type { ButtonProps } from 'ant-design-vue'

const props = defineProps<ButtonProps & {
  icon: Component
  action: () => void | Promise<void>
  label: string
  disabled?: boolean
  loading?: boolean | DelayLoading
}>()

const { icon, action, label, disabled, loading, ...inheritedProps } = props

interface DelayLoading {
  delay: number
}

const isLoading = ref<boolean | DelayLoading>(false)

const handleClick = async () => {
  if (props.loading === undefined) isLoading.value = { delay: 100 }
  await props.action()
  if (props.loading === undefined) isLoading.value = false
}

watch(props, () => {
  if (props.loading === undefined) return
  isLoading.value = props.loading
})
</script>

<template>
  <a-button
    v-bind="inheritedProps"
    class="btn-custom-large"
    size="large"
    style="display: flex; flex-direction: column; height: unset;"
    :loading="isLoading"
    :disabled="props.disabled"
    @click="handleClick"
  >
    <template #icon>
      <component :is="props.icon" style="font-size: 1.4em;" />
    </template>
    <span style="color: inherit">{{ props.label }}</span>
  </a-button>
</template>

<style scoped>
.btn-custom-large :deep(.ant-btn-loading-icon) {
  font-size: 0.89em;
}

.btn-custom-large :deep(.anticon + span) {
  margin-inline-start: 0 !important;
}

.btn-custom-large :deep(.ant-btn-loading-icon > .anticon-loading) {
  margin-inline-end: 0 !important;
}
</style>
