<template>
  <div class="grid">
    <div class="col" />
    <div class="col-12 md:col-6 lg:col-3">
      <Card>
        <template #title>
          Hello World
        </template>
        <template #content>
          <p class="m-0">
            First Layouting Test
          </p>
        </template>
      </Card>
    </div>
    <div class="col"/>
  </div>
</template>

<script setup lang="ts">
import { Card } from 'primevue'
</script>
