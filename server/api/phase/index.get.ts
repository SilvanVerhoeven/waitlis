import prisma from '~/lib/prisma'
import authorize from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  // await authorize(event, Role.MANAGER)
  // Until phase/current is implemented
  return await prisma.phase.findMany()
})
