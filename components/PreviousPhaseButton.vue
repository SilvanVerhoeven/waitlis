<script setup>
import { FastBackwardOutlined } from '#components'

const phaseStore = usePhaseStore()
</script>

<template>
  <BigButton
    :icon="FastBackwardOutlined"
    label="Zurück"
    :action="phaseStore.previousPhase"
    :disabled="!phaseStore.hasPreviousPhase"
  />
</template>
