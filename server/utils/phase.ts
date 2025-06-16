import prisma from '~/lib/prisma'

export const getCurrentPhase = async () => {
  return await prisma.phase.findFirstOrThrow({ where: { isCurrent: true } })
}
