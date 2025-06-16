import { entropy } from 'string-entropy'
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event): Promise<SessionUser> => {
  await clearUserSession(event)

  const parsedResult = await readValidatedBody(event, ZRegistrationInput.safeParse)
  if (parsedResult.error) throw parsedResult.error

  const { username, password, displayName } = parsedResult.data

  const existingUser = await prisma.user.findFirst({ where: { name: username } })

  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username already in use',
    })
  }

  if (entropy(password) < (parseInt(process.env.MIN_PASSWORD_ENTROPY ?? '') || 80)) {
    throw createError({
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

  // ToDo: Make Login work directl.y User is redirected to login after registration, instead of being logged in

  return { id: user.id, role: user.role }
})
