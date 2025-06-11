import type { z } from 'zod/v4'
import prisma from '~/lib/prisma'
import { ZUpdateQueueParams } from './[id].post'

export const ZCreateQueueParams = ZUpdateQueueParams
export type CreateQueueParams = z.infer<typeof ZCreateQueueParams>

export default defineEventHandler(async (event) => {
  const parsedQueue = await readValidatedBody(event, ZCreateQueueParams.safeParse)
  if (parsedQueue.error) throw parsedQueue.error

  const newQueue = await prisma.queue.create({ data: {
    ...parsedQueue.data,
    name: parsedQueue.data.name ?? undefined,
  } })
  return newQueue
})
