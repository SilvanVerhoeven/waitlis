import prisma from '~/lib/prisma'

const sendLoginError = () => {
  return createError({
    statusCode: 401,
    statusMessage: 'Nutzername oder Passwort falsch',
  })
}

export default defineEventHandler(async (event) => {
  await clearUserSession(event)
  const body = await readBody(event)
  const { username, password } = body

  const user = await prisma.user.findFirst({ where: { name: username ?? null } })

  if (!user) return sendLoginError()

  const isPasswordValid = await verifyPassword(user.password, password)

  if (!isPasswordValid) return sendLoginError()

  const sessionUser: SessionUser = {
    id: user.id,
    role: user.role,
  }

  await setUserSession(event, {
    user: sessionUser,
  })

  return sessionUser
})
