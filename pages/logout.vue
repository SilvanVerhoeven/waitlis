<script lang="ts" setup>
const handleMessage = () => {
  message.info('This is a normal message')
}
</script>

<template>
  <a-button primary @click="handleMessage">
    Show Message
  </a-button>
  <a-button href="/api/auth/logout">
    Logout
  </a-button>
</template>
