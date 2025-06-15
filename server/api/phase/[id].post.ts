import prisma from '~/lib/prisma'
import authorize from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await authorize(event, Role.MANAGER)

  const parsedPhaseId = ZPhaseId.safeParse(getRouterParam(event, 'id'))
  if (parsedPhaseId.error) throw parsedPhaseId.error

  const parsedPhase = await readValidatedBody(event, ZUpdatePhaseParams.safeParse)
  if (parsedPhase.error) throw parsedPhase.error

  // only one phase may be the current one
  if (parsedPhase.data.isCurrent) {
    const updatedPhases = await prisma.phase.updateManyAndReturn({ where: { isCurrent: true }, data: { isCurrent: false } })
    updatedPhases.forEach(phase => getSSEStore().notify('UpdatePhase', phase))
  }

  const updatedPhase = await prisma.phase.update({ where: { id: parsedPhaseId.data }, data: {
    ...parsedPhase.data,
    name: parsedPhase.data.name ?? undefined,
    previousId: parsedPhase.data.previousId ?? undefined,
  } })

  getSSEStore().notify('UpdatePhase', updatedPhase)
})
