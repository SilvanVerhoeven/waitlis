import { prisma } from "@/app/lib/db"
import { ErrorResponse, isErrorResponse } from "@/app/lib/types"
import { Phase, PhaseStatus } from "@prisma/client"
import { revalidateTag } from "next/cache"

export async function GET() {
  return Response.json(await prisma.phase.findMany({ where: { status: PhaseStatus.OPEN } }))
}

export async function POST() {
  const latestPhase: Phase | ErrorResponse = await (await fetch(`${process.env.SERVER_URL}/api/phase/latest`, { next: { tags: ['phases'] } })).json()
  const newPhase = await prisma.phase.create({ data: { status: PhaseStatus.OPEN, previousId: !isErrorResponse(latestPhase) ? latestPhase.id : undefined } })
  revalidateTag('phases')
  return Response.json(newPhase)
}