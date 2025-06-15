import prisma from '~/lib/prisma'
import authorize from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await authorize(event, Role.MANAGER)

  const parseResult = await readValidatedBody(event, ZCreateQueueParams.safeParse)
  if (parseResult.error) throw parseResult.error

  const { id: eagerId, ...parsedQueue } = parseResult.data

  const newQueue = await prisma.queue.create({ data: {
    ...parsedQueue,
    name: parsedQueue.name ?? undefined,
  } })

  getSSEStore().notify('CreateQueue', { eagerId, queue: newQueue })
})
