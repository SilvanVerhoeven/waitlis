import prisma from '~/lib/prisma'
import { SYSTEM_TAG_IDS } from '~/shared/types/enums'

export const getTagIdsForQueue = async (queueId: Queue['id']) => {
  return (await prisma.tag.findMany({ where: { queue: { some: { id: queueId } } }, select: { id: true } })).map(tag => tag.id)
}

export const getSystemTagIdsForMember = async (memberId: Member['id']) => {
  const systemTagIds: Tag['id'][] = []
  if (await isFirstRegistrationInPhase(memberId)) systemTagIds.push(SYSTEM_TAG_IDS.FIRST_REGISTRATION_IN_PHASE)
  return systemTagIds
}
