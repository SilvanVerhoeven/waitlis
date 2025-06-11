import type { EventHandlerRequest, H3Event } from 'h3'
import prisma from '~/lib/prisma'

export const updateSessionUser = async (event: H3Event<EventHandlerRequest>) => {
  const { user } = await getUserSession(event)

  if (!user) return

  const userData = await prisma.user.findUnique({ where: { id: user.id } })
  if (!userData) {
    await clearUserSession(event)
    return
  }

  // ToDo: extend session and logout if max age reached
  await setUserSession(event, {
    user: {
      role: userData.role,
    },
  })
}
