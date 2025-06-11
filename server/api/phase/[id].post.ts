import type { z } from 'zod/v4'
import prisma from '~/lib/prisma'

export const ZUpdatePhaseParams = ZPhase.omit({ id: true, createdAt: true })
export type UpdatePhaseParams = z.infer<typeof ZUpdatePhaseParams>

export default defineEventHandler(async (event) => {
  const parsedPhaseId = ZPhaseId.safeParse(getRouterParam(event, 'id'))
  if (parsedPhaseId.error) throw parsedPhaseId.error

  const parsedPhase = await readValidatedBody(event, ZUpdatePhaseParams.safeParse)
  if (parsedPhase.error) throw parsedPhase.error

  // only one phase may be the current one
  if (parsedPhase.data.isCurrent) await prisma.phase.updateMany({ where: { isCurrent: true }, data: { isCurrent: false } })

  return await prisma.phase.update({ where: { id: parsedPhaseId.data }, data: {
    ...parsedPhase.data,
    name: parsedPhase.data.name ?? undefined,
    previousId: parsedPhase.data.previousId ?? undefined,
  } })
})
