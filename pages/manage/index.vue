<script setup lang="ts">
definePageMeta({
  layout: 'manage',
})

const queueStore = useQueueStore()
</script>

<template>
  <a-layout style="padding: 0; height: 100vh">
    <a-layout>
      <a-layout-content style="margin: 24px 16px 0">
        <a-row justify="center">
          <a-col>
            <a-row justify="center" :gutter="5">
              <a-col v-for="queue in queueStore.queues" :key="queue.id">
                <QueueDisplay :queue="queue" />
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-layout-content>
    </a-layout>
    <a-layout-footer
      class="control-panel"
      style="background: white; box-shadow: 10px 0px 10px lightgray"
    >
      <a-row :gutter="10" justify="center">
        <a-col>
          <a-divider orientation="left" orientation-margin="0">
            <a-typography-title
              :level="5"
              style="margin-top: 0; display: inline"
            >
              Tagesordnung
            </a-typography-title>
          </a-divider>
          <a-row :gutter="10">
            <a-col>
              <PreviousPhaseButton />
            </a-col>
            <a-col>
              <NextPhaseButton />
            </a-col>
          </a-row>
        </a-col>
        <a-col><a-divider type="vertical" /></a-col>
        <a-col>
          <a-divider orientation="left" orientation-margin="0">
            <PhaseStatusIndicator />
            <a-typography-title
              :level="5"
              style="margin-top: 0; display: inline"
            >
              Redeliste
            </a-typography-title>
          </a-divider>
          <a-row :gutter="10">
            <a-col>
              <NewQueueButton />
            </a-col>
            <a-col>
              <PhaseStatusToggle />
            </a-col>
            <a-col>
              <!-- registrations.length === 0 -->
              <CallNextButton
                :disabled="false"
              />
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-layout-footer>
  </a-layout>
</template>
