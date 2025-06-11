import type { z } from 'zod/v4'
import prisma from '~/lib/prisma'
import authorize from '~/server/utils/auth'
import { ZUpdatePhaseParams } from './[id].post'

export const ZCreatePhaseParams = ZUpdatePhaseParams
export type CreatePhaseParams = z.infer<typeof ZCreatePhaseParams>

export default defineEventHandler(async (event) => {
  await authorize(event, Role.MANAGER)

  const parseResult = await readValidatedBody(event, ZCreatePhaseParams.safeParse)
  if (parseResult.error) throw parseResult.error

  const parsedPhase = parseResult.data

  const previousPhase = (parsedPhase.previousId === null)
    ? await prisma.phase.findFirst({ where: { next: null } })
    : await prisma.phase.findUnique({ where: { id: parsedPhase.previousId } })

  if (!previousPhase) {
    const isFirstPhase = (await prisma.phase.count()) === 0
    if (!isFirstPhase) throw new Error(`No previous phase found. PreviousPhaseId: ${previousPhase}`)
  }

  // only one phase may be the current one
  if (parsedPhase.isCurrent) await prisma.phase.updateMany({ where: { isCurrent: true }, data: { isCurrent: false } })

  const newPhase = await prisma.phase.create({ data: {
    ...parsedPhase,
    name: parsedPhase.name ?? undefined,
    previousId: previousPhase?.id ?? undefined,
  } })

  // point next phase to inserted phase
  if (previousPhase && parsedPhase.previousId !== null) {
    await prisma.phase.update({ where: { previousId: previousPhase.id, NOT: { id: newPhase.id } }, data: { previousId: newPhase.id } })
  }

  return newPhase
})
