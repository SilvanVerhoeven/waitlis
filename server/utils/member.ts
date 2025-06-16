import prisma from '~/lib/prisma'

/**
 * Returns true if given member has not yet spoken in the current phase.
 *
 * @param memberId ID of member to check for
 * @returns True, if there is no registration for this member in the current phase with the status for being handled entirely
 */
export const isFirstRegistrationInPhase = async (memberId: Member['id']) => {
  return (await prisma.registration.count({
    where: { memberId, phase: { isCurrent: true }, status: { equals: RegistrationStatus.HANDLED } },
  })) === 0
}

export const isExistingMember = async (id: Member['id']) => {
  return await prisma.member.count({ where: { id } }) === 1
}

export const generateMemberSecret = (): string => {
  return crypto.randomUUID()
}

export const getAuthenticatedMember = async (id: Member['id'], secret: string) => {
  const member = await prisma.member.findFirst({ where: { id } })
  if (!member) return null
  if (!(await verifyPassword(member.secret, secret))) return null
  return member
}

export const createMember = async (secret: string) => {
  return await prisma.member.create({ data: { secret: await hashPassword(secret) } })
}
