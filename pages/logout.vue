<script lang="ts" setup>
definePageMeta({
  layout: 'default',
})
await $fetch('/api/auth/logout')
navigateTo('/')
</script>
