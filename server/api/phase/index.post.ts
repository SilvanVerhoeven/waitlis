import prisma from '~/lib/prisma'
import authorize from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await authorize(event, Role.MANAGER)

  const parseResult = await readValidatedBody(event, ZCreatePhaseParams.safeParse)
  if (parseResult.error) throw parseResult.error

  const { id: eagerId, ...parsedPhase } = parseResult.data

  const previousPhase = (parsedPhase.previousId === null)
    ? await prisma.phase.findFirst({ where: { next: null } })
    : await prisma.phase.findUnique({ where: { id: parsedPhase.previousId } })

  if (!previousPhase) {
    const isFirstPhase = (await prisma.phase.count()) === 0
    if (!isFirstPhase) throw new Error(`No previous phase found. PreviousPhaseId: ${previousPhase}`)
  }

  // only one phase may be the current one
  if (parsedPhase.isCurrent) {
    const updatedPhases = await prisma.phase.updateManyAndReturn({ where: { isCurrent: true }, data: { isCurrent: false } })
    updatedPhases.forEach(phase => getSSEStore().notify('UpdatePhase', phase))
  }

  const newPhase = await prisma.phase.create({ data: {
    ...parsedPhase,
    name: parsedPhase.name ?? undefined,
    previousId: previousPhase?.id ?? undefined,
  } })

  getSSEStore().notify('CreatePhase', { eagerId, phase: newPhase })

  // point next phase to inserted phase
  if (previousPhase && parsedPhase.previousId !== null) {
    const updatedPhase = await prisma.phase.update({ where: { previousId: previousPhase.id, NOT: { id: newPhase.id } }, data: { previousId: newPhase.id } })
    getSSEStore().notify('UpdatePhase', updatedPhase)
  }
})
