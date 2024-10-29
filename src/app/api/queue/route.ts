'use server'

import { prisma } from "@/app/lib/db"
import { ErrorResponse, isErrorResponse } from "@/app/lib/types"
import { Member, Phase, Queue, Registration } from "@prisma/client"
import { revalidateTag } from "next/cache"

export interface RegistrationWithMember extends Registration {
  member: Member
}

export interface QueueWithRegistrations extends Queue {
  registrations: Registration[]
}

export interface QueueWithRegistrationsAndMembers extends Queue {
  registrations: RegistrationWithMember[]
}

/**
 * Returns all queues with their registrations from the current phase
 */
export async function GET() {
  const latestPhase: Phase | ErrorResponse = await (await fetch(`${process.env.SERVER_URL}/api/phase/latest`, { next: { tags: ['phases'] } })).json()

  if (isErrorResponse(latestPhase)) return Response.json([])

  return Response.json(await prisma.queue.findMany({
    include: {
      registrations: {
        where: { phaseId: latestPhase.id },
        include: { member: true }
      }
    }
  }))
}

export async function POST() {
  const newQueue = await prisma.queue.create({ data: { name: "" } })
  revalidateTag('queues')
  return Response.json(newQueue)
}