<script setup>
import { FastForwardOutlined } from '#components'

const phaseStore = usePhaseStore()
</script>

<template>
  <BigButton
    :icon="FastForwardOutlined"
    label="Nächster Punkt"
    :action="phaseStore.nextPhase"
  />
</template>
