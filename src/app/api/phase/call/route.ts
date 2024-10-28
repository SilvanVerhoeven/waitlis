import { Queue, Registration, RegistrationStatus } from "@prisma/client"
import { GET as getQueues, QueueWithRegistrations, RegistrationWithMember } from '@/app/api/queue/route'

export const closedRegistrationStatus: RegistrationStatus[] = [RegistrationStatus.HANDLED, RegistrationStatus.SKIPPED, RegistrationStatus.WITHDRAWN]

const isOpen = (registration: Registration) => !closedRegistrationStatus.includes(registration.status)

export const byQueueOrder = (a: QueueWithRegistrations, b: QueueWithRegistrations) => {
  if (a.registrations.length == 0) return 1
  if (b.registrations.length == 0) return -1
  if (!!a.registrations.find(registration => registration.status === RegistrationStatus.ACTIVE)) return -1
  if (!!b.registrations.find(registration => registration.status === RegistrationStatus.ACTIVE)) return 1
  return a.registrations[0].createdAt.getTime() - b.registrations[0].createdAt.getTime()
}

export const byRegistrationOrder = (respectNext: boolean) => (a: RegistrationWithMember, b: RegistrationWithMember) => {
  if (a.status === RegistrationStatus.ACTIVE) return -1
  if (b.status === RegistrationStatus.ACTIVE) return 1
  if (respectNext && a.status === RegistrationStatus.NEXT) return -1
  if (respectNext && b.status === RegistrationStatus.NEXT) return 1
  if (a.firstInPhase != b.firstInPhase) {
    if (a.firstInPhase) return -1
    if (b.firstInPhase) return 1
  }
  return a.createdAt.getTime() - b.createdAt.getTime()
}

/**
 * Returns all unhandled registrations for the current phase in their global call order
 */
export async function GET({ respectNext = true, limit }: { respectNext?: boolean, limit?: number }): Promise<Registration[]> {
  const queues = await getQueues()
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

  return globalCallOrder.slice(0, limit)
}