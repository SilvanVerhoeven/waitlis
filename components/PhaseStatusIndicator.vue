<script setup lang="ts">
import type { PhaseStatus } from '#imports'

const phaseStore = usePhaseStore()

const getIndicatorStatus = (phaseStatus: PhaseStatus): 'success' | 'error' => {
  if (phaseStatus === 'OPEN') return 'success'
  return 'error'
}

const indicatorStatus = ref(getIndicatorStatus(phaseStore.current.status))

phaseStore.$subscribe(() => {
  if (phaseStore.isTogglingStatus) return
  indicatorStatus.value = getIndicatorStatus(phaseStore.current.status)
})
</script>

<template>
  <a-badge :status="indicatorStatus" />
</template>
