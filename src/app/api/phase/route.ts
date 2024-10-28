import { prisma } from "@/app/layout"
import { PhaseStatus } from "@prisma/client"
import { GET as getLatestPhase } from "@/app/api/phase/latest/route"

export async function GET() {
  return await prisma.phase.findMany({ where: { status: PhaseStatus.OPEN } })
}

export async function POST() {
  const latestPhase = await getLatestPhase()
  await prisma.phase.create({ data: { status: PhaseStatus.OPEN, previousId: latestPhase?.id } })
}