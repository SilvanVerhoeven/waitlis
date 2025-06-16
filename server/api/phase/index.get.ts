import prisma from '~/lib/prisma'
import { isAuthorized } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  return await isAuthorized(event, Role.MANAGER) ? await prisma.phase.findMany() : [await getCurrentPhase()]
})
