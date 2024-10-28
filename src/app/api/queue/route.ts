'use server'

import { prisma } from "@/app/layout"
import { GET as getLatestPhase } from '@/app/api/phase/latest/route'
import { Member, Queue, Registration } from "@prisma/client"

export interface RegistrationWithMember extends Registration {
  member: Member
}

export interface QueueWithRegistrations extends Queue {
  registrations: Registration[]
}

/**
 * Returns all queues with their registrations from the current phase
 */
export async function GET() {
  const latestPhase = await getLatestPhase()
  return await prisma.queue.findMany({
    include: {
      registrations: {
        where: { phaseId: latestPhase?.id ?? -1 },
        include: { member: true }
      }
    }
  })
}

export async function POST() {
  return Response.json(await prisma.queue.create({ data: { name: "" } }))
}