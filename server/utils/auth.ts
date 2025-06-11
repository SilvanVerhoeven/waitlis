import type { EventHandlerRequest, H3Event } from 'h3'
import { updateSessionUser } from './session'

/**
 * Throws error if the user does not have a role sufficient for the given role.
 *
 * @param role Role the user has to suffice
 */
const authorize = async (event: H3Event<EventHandlerRequest>, role: Role) => {
  await updateSessionUser(event)

  const { user } = await requireUserSession(event)

  if (user.role === role) return
  if (user.role === Role.ADMIN && role === Role.MANAGER) return
  if (user.role === Role.ADMIN && role === Role.USER) return
  if (user.role === Role.MANAGER && role === Role.USER) return

  throw createError({ statusCode: 403, statusMessage: 'Forbbiden', stack: undefined })
}

export default authorize
