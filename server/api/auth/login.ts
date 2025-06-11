import prisma from '~/lib/prisma'

const sendLoginError = () => {
  return createError({
    statusCode: 400,
    statusMessage: 'Username or password are wrong',
  })
}

export default defineEventHandler(async (event) => {
  await clearUserSession(event)
  const body = await readBody(event)
  const { name, password } = body

  const user = await prisma.user.findFirst(name)

  if (!user) return sendLoginError()

  const isPasswordValid = verifyPassword(user.password, password)

  if (!isPasswordValid) return sendLoginError()

  await setUserSession(event, {
    user: {
      id: user.id,
      role: user.role,
    },
  })

  return sendRedirect(event, '/manage')
})
