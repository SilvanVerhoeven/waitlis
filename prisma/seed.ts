import prisma from '~/lib/prisma'

const SYSTEM_TAGS: Tag[] = [
  { id: 1, name: 'Neu' },
]

const DEV_TAGS: Tag[] = [
  { id: 2, name: 'Queue A' },
  { id: 3, name: 'Queue B' },
]

const DEV_QUEUES: CreateQueueParams[] = [
  { id: 1, name: 'Queue A' },
  { id: 2, name: 'Queue B' },
]

const DEV_LANES: CreateLaneParams[] = [
  { id: 1, condition: 't.2' },
  { id: 2, condition: 't.3' },
]

const createInitialPhase = async () => {
  const hasPhases = (await prisma.phase.count()) > 0
  if (!hasPhases) await prisma.phase.create({ data: { isCurrent: true, status: 'CLOSED' } })
}

const createSystemTags = async () => {
  SYSTEM_TAGS.forEach(async tag => await prisma.tag.upsert({ where: { id: tag.id }, create: { id: tag.id, name: tag.name }, update: {} }))
}

const createInitialQueueSetup = async () => {
  const hasQueues = (await prisma.queue.count()) > 0
  if (hasQueues) return
  await prisma.tag.createMany({ data: DEV_TAGS })
  await prisma.queue.createMany({ data: DEV_QUEUES })
  await prisma.queue.createMany({ data: DEV_LANES })
}

const main = async () => {
  await createInitialPhase()
  await createSystemTags()
  await createInitialQueueSetup()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
