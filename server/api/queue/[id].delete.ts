import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const parsedQueueId = ZQueueId.safeParse(getRouterParam(event, 'id'))
  if (parsedQueueId.error) throw parsedQueueId.error
  return await prisma.queue.delete({ where: { id: parsedQueueId.data } })
})
