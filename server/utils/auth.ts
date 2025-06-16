import type { EventHandlerRequest, H3Event } from 'h3'
import { updateSessionUser } from './session'

/**
 * Returns whether the logged in user is authorized for the given role.
 * Does not throw an error, unlike `authorize`.
 *
 * @param role Role the user has to suffice
 */
export const isAuthorized = async (event: H3Event<EventHandlerRequest>, role: Role) => {
  await updateSessionUser(event)

  const { user } = await getUserSession(event)

  if (!user) return false

  if (user.role === role) return true
  if (user.role === Role.ADMIN && role === Role.MANAGER) return true
  if (user.role === Role.ADMIN && role === Role.USER) return true
  if (user.role === Role.MANAGER && role === Role.USER) return true

  return false
}

/**
 * Throws error if the user does not have a role sufficient for the given role.
 *
 * @param role Role the user has to suffice
 */
const authorize = async (event: H3Event<EventHandlerRequest>, role: Role) => {
  await requireUserSession(event) // Throw 401 automatically of not logged in

  if (await isAuthorized(event, role)) return

  throw createError({ statusCode: 403, statusMessage: 'Forbbiden', stack: undefined })
}

export default authorize
