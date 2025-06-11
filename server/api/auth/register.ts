import { entropy } from 'string-entropy'
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  await clearUserSession(event)
  const body = await readBody<RegistrationInput>(event)
  const { username, password, displayName } = body

  const existingUser = await prisma.user.findFirst({ where: { name: username } })

  if (existingUser) {
    return createError({
      statusCode: 400,
      statusMessage: 'Username already in use',
    })
  }

  if (entropy(password) < (parseInt(process.env.MIN_PASSWORD_ENTROPY ?? '') || 80)) {
    return createError({
      statusCode: 400,
      statusMessage: 'Password insecure. Consider using a longer password or a mix of uppercase, lowercase, numerical and special characters',
    })
  }

  const isFirstUser = (await prisma.user.count()) === 0

  const user = await prisma.user.create({
    data: {
      name: username,
      password: await hashPassword(password),
      displayName,
      role: isFirstUser ? 'ADMIN' : undefined,
    },
  })

  await setUserSession(event, {
    user: {
      id: user.id,
      role: user.role,
    },
  })
})
