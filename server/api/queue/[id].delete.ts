import prisma from '~/lib/prisma'
import authorize from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await authorize(event, Role.MANAGER)

  const parsedQueueId = ZQueueId.safeParse(getRouterParam(event, 'id'))
  if (parsedQueueId.error) throw parsedQueueId.error
  const deleteQueue = await prisma.queue.delete({ where: { id: parsedQueueId.data } })
  getSSEStore('manage').notify('DeleteQueue', deleteQueue)
})
