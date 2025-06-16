import prisma from '~/lib/prisma'

export default defineEventHandler(async (event): Promise<CreateRegistrationResult> => {
  const parseResult = await readValidatedBody(event, ZCreateRegistrationParams.safeParse)
  if (parseResult.error) throw parseResult.error

  const currentPhase = await getCurrentPhase()

  if (currentPhase.status !== PhaseStatus.OPEN) throw createError({ statusCode: 400, statusMessage: 'Currently not open for registrations' })

  const memberId = getCookie(event, COOKIE_IDS.MEMBER_ID) ?? null
  const memberSecret = getCookie(event, COOKIE_IDS.MEMBER_SECRET) ?? null

  const parsedQueue = parseResult.data

  let member: Member | null = memberId !== null && memberSecret !== null
    ? await getAuthenticatedMember(memberId, memberSecret)
    : null

  if (!member) {
    const secret = generateMemberSecret()
    member = await createMember(secret)
    setCookie(event, COOKIE_IDS.MEMBER_ID, member.id)
    setCookie(event, COOKIE_IDS.MEMBER_SECRET, secret)
  }

  const hasPendingRegistration = await prisma.registration.count({ where: { memberId: member.id, phaseId: currentPhase.id, status: { notIn: ARCHIVED_REGISTRATION_STATUSES } } }) > 0

  if (hasPendingRegistration) throw createError({ statusCode: 400, statusMessage: 'User has pending registration' })

  const tagIds = [...await getTagIdsForQueue(parsedQueue.id), ...await getSystemTagIdsForMember(member.id)]

  const newRegistration = await prisma.registration.create({ data: {
    queueId: parsedQueue.id,
    memberId: member.id,
    phaseId: currentPhase.id,
    status: RegistrationStatus.QUEUED,
    tags: { connect: tagIds.map(id => ({ id })) },
  } })

  // ToDo: Display registration in manager view
  // ToDo: Update positions of other connected members
  // getSSEStore().notify('CreateRegistration', newRegistration)

  return { position: 0, registration: newRegistration } // ToDo: enrich with place etc
})
