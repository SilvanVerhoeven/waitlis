import prisma from '~/lib/prisma'

const createInitialPhase = async () => {
  const hasPhases = (await prisma.phase.count()) > 0
  if (!hasPhases) await prisma.phase.create({ data: { isCurrent: true, status: 'CLOSED' } })
}

const main = async () => {
  await createInitialPhase()
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
