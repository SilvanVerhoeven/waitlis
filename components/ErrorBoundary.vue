<script setup lang="ts">
import type { NuxtError } from '#app'
import { openNotificationWithIcon } from '#imports'

onErrorCaptured((error: Error | NuxtError) => {
  console.error(error)

  let message = error instanceof Error ? error.name : 'Ein unbekannter Fehler ist aufgetreten'
  let description = error instanceof Error ? String(error.message) : undefined

  if (message.startsWith('[silent]')) return false

  // Direct type check not applicable. We might encounter error types other then NuxtError that also have a usable `statusCode` attribute
  const statusCode = Object.prototype.hasOwnProperty.call(error, 'statusCode') ? (error as NuxtError).statusCode : undefined

  if (statusCode === 403) {
    message = 'Zugriff verweigert'
    description = 'Sie haben nicht die nötigen Zugriffsrechte'
  }
  else if (statusCode === 401) {
    message = 'Anmeldung nötig'
    description = 'Melden Sie sich an, um fortzufahren'
  }

  openNotificationWithIcon('error', message, description)
  return false
})
</script>

<template>
  <slot />
</template>
