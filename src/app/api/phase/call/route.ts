import { Queue, Registration, RegistrationStatus } from "@prisma/client"
import { QueueWithRegistrations, QueueWithRegistrationsAndMembers, RegistrationWithMember } from '@/app/api/queue/route'
import { closedRegistrationStatus } from "@/app/lib/registration"
import { NextRequest } from "next/server"

const isOpen = (registration: Registration) => !closedRegistrationStatus.includes(registration.status)

const byQueueOrder = (a: QueueWithRegistrations, b: QueueWithRegistrations) => {
  if (a.registrations.length == 0) return 1
  if (b.registrations.length == 0) return -1
  if (!!a.registrations.find(registration => registration.status === RegistrationStatus.ACTIVE)) return -1
  if (!!b.registrations.find(registration => registration.status === RegistrationStatus.ACTIVE)) return 1
  return (new Date(a.registrations[0].createdAt)).getTime() - (new Date(b.registrations[0].createdAt)).getTime()
}

const byRegistrationOrder = (respectNext: boolean) => (a: RegistrationWithMember, b: RegistrationWithMember) => {
  if (a.status === RegistrationStatus.ACTIVE) return -1
  if (b.status === RegistrationStatus.ACTIVE) return 1
  if (respectNext && a.status === RegistrationStatus.NEXT) return -1
  if (respectNext && b.status === RegistrationStatus.NEXT) return 1
  if (a.firstInPhase != b.firstInPhase) {
    if (a.firstInPhase) return -1
    if (b.firstInPhase) return 1
  }
  return (new Date(a.createdAt)).getTime() - (new Date(b.createdAt)).getTime()
}

/**
 * Returns all unhandled registrations for the current phase in their global call order
 */
export async function GET(request: NextRequest): Promise<Response> {
  const searchParams = request.nextUrl.searchParams
  const respectNext = Boolean(searchParams.get('respectNext') ?? true)
  const limit = searchParams.get('limit') === null ? undefined : Number(searchParams.get('limit'))

  const queues: QueueWithRegistrationsAndMembers[] = await (await fetch(`${process.env.SERVER_URL}/api/queue`, { next: { tags: ['queues', 'phases', 'order'] } })).json()
  queues.forEach(queue => queue.registrations = queue.registrations.filter(isOpen).sort(byRegistrationOrder(respectNext)))

  queues.sort(byQueueOrder)

  const globalCallOrder: Registration[] = []

  const queueIndices: Record<Queue["id"], number> = {}
  queues.forEach(queue => queueIndices[queue.id] = 0)

  while (queues.some(queue => queueIndices[queue.id] < queue.registrations.length)) {
    for (let i = 0; i < queues.length; i++) {
      const queue = queues[i]
      if (queueIndices[queue.id] >= queue.registrations.length) continue

      const registration = queue.registrations[queueIndices[queue.id]]
      globalCallOrder.push(registration)
      queueIndices[queue.id]++
    }
  }

  return Response.json(globalCallOrder.slice(0, limit))
}