import type { z } from 'zod/v4'
import prisma from '~/lib/prisma'
import authorize from '~/server/utils/auth'

export const ZUpdateQueueParams = ZQueue.omit({ id: true, createdAt: true })
export type UpdateQueueParams = z.infer<typeof ZUpdateQueueParams>

export default defineEventHandler(async (event) => {
  await authorize(event, Role.MANAGER)

  const parsedQueueId = ZQueueId.safeParse(getRouterParam(event, 'id'))
  if (parsedQueueId.error) throw parsedQueueId.error

  const parsedQueue = await readValidatedBody(event, ZUpdateQueueParams.safeParse)
  if (parsedQueue.error) throw parsedQueue.error

  return await prisma.queue.update({ where: { id: parsedQueueId.data }, data: {
    ...parsedQueue.data,
    name: parsedQueue.data.name ?? undefined,
  } })
})
