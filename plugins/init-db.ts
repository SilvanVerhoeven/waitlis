import type { CreatePhaseParams } from '~/server/api/phase/index.post'

const createInitialPhase = async () => {
  const phases = await $fetch('/api/phase')
  const params: Partial<CreatePhaseParams> = { isCurrent: true }
  if (phases.length === 0) await $fetch('/api/phase', { method: 'POST', body: params })
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:created', createInitialPhase)
})
