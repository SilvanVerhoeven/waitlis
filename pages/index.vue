<script lang="ts" setup>
const queueStore = useQueueStore()
const { data: openPhases } = await useFetch('/api/phase')
</script>

<template>
  <a-layout style="padding: 0; height: 100vh; overflow: hidden">
    <a-layout-content style="padding: 0; margin: 0; display: flex; justify-content: center; align-items: center">
      <!-- <PollPage interval="{Number(process.env.POLLING_INTERVAL_APP)}" /> -->
      <!-- {isErrorResponse(position) ? -->
      <a-row justify="center">
        <a-col>
          <QueueSelector :queues="queueStore.queues" :open="(openPhases ?? []).length > 0" />
        </a-col>
      </a-row>
      <!-- : -->
      <a-row justify="center">
        <a-col>
          <!-- <MemberStatus position="{position}" /> -->
        </a-col>
      </a-row>
      <!-- } -->
    </a-layout-content>
    <a-layout-content style="flex: 0 0 3rem">
      <a-row justify="center" align="middle" :gutter="10">
        <a-col>
          <a-button type="link" href="/impressum">
            Impressum
          </a-button>
        </a-col>
        <a-col>
          &bull;
        </a-col>
        <a-col>
          <a-button type="link" href="/datenschutz">
            Datenschutz
          </a-button>
        </a-col>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>
