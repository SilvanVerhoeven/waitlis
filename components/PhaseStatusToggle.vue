<script setup lang="ts">
import { LockOutlined, UnlockOutlined } from '@ant-design/icons-vue'

const phaseStore = usePhaseStore()

const options = ref([
  {
    value: 'CLOSED',
    icon: LockOutlined,
    label: 'Geschlossen',
  },
  {
    value: 'OPEN',
    icon: UnlockOutlined,
    label: 'Geöffnet',
  },
])
</script>

<template>
  <BigSegmented
    :value="phaseStore.current.status"
    :options="options"
    :on-change="phaseStore.toggleCurrentPhaseStatus"
    :ready="phaseStore.isValidState"
  />
</template>
