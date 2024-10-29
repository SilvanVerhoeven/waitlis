"use server"

import { cookies } from 'next/headers'
import { Phase, PhaseStatus, Queue, Registration, RegistrationStatus } from "@prisma/client"
import { closedRegistrationStatus } from './lib/registration'
import { prisma } from './lib/db'
import { ErrorResponse, isErrorResponse } from './lib/types'
import { revalidateTag } from 'next/cache'

export const renameQueue = async (queue: Queue, newName: string) => {
  await prisma.queue.update({
    where: { id: queue.id },
    data: { name: newName }
  })
  revalidateTag('queues')
}

export const createQueue = async () => {
  return await (await fetch(`${process.env.SERVER_URL}/api/queue`, { method: "POST" })).json()
}

export const nextPhase = async () => {
  const phase: Phase | ErrorResponse = await (await fetch(`${process.env.SERVER_URL}/api/phase/latest`, { next: { tags: ['phases'] } })).json()
  if (!isErrorResponse(phase)) {
    await prisma.registration.updateMany({ where: { phaseId: phase.id, status: { notIn: closedRegistrationStatus } }, data: { status: RegistrationStatus.DECLINED } })
    revalidateTag('order')
  }
  await setPhaseStatus(PhaseStatus.CLOSED)
  return await (await fetch(`${process.env.SERVER_URL}/api/phase`, { method: "POST" })).json()
}

export const setPhaseStatus = async (status: PhaseStatus) => {
  const phase: Phase | ErrorResponse = await (await fetch(`${process.env.SERVER_URL}/api/phase/latest`, { next: { tags: ['phases'] } })).json()
  if (isErrorResponse(phase)) return { error: "No phase available. Create a phase first" }
  await prisma.phase.update({
    where: { id: phase.id },
    data: { status }
  })
}

export const togglePhaseStatus = async () => {
  const phase: Phase | ErrorResponse = await (await fetch(`${process.env.SERVER_URL}/api/phase/latest`, { next: { tags: ['phases'] } })).json()
  if (isErrorResponse(phase)) return { error: "No phase available. Create a phase first" }
  await prisma.phase.update({
    where: { id: phase.id },
    data: { status: phase.status === PhaseStatus.CLOSED ? PhaseStatus.OPEN : PhaseStatus.CLOSED }
  })
  revalidateTag('phases')
}

export const callNext = async () => {
  await prisma.registration.updateMany({
    where: { status: RegistrationStatus.ACTIVE },
    data: { status: RegistrationStatus.HANDLED }
  })

  revalidateTag('order')

  const order: Registration[] = await (await fetch(`${process.env.SERVER_URL}/api/phase/call`, { next: { tags: ['order', 'phases'] } })).json()

  if (order[0]) {
    await prisma.registration.update({
      where: { id: order[0].id },
      data: { status: RegistrationStatus.ACTIVE }
    })
  }

  if (order[1]) {
    await prisma.registration.update({
      where: { id: order[1].id },
      data: { status: RegistrationStatus.NEXT }
    })
  }

  revalidateTag('order')
}

export const setAsNext = async (registration: Registration) => {
  await prisma.registration.updateMany({
    where: { status: RegistrationStatus.NEXT },
    data: { status: RegistrationStatus.QUEUED }
  })

  await prisma.registration.update({
    where: { id: registration.id },
    data: { status: RegistrationStatus.NEXT }
  })

  revalidateTag('order')
}

export const enqueue = async (queue: Queue) => {
  const cookieStore = await cookies()

  const clientMemberId = cookieStore.get("memberId")?.value

  const member = (await prisma.member.upsert({
    where: { id: clientMemberId ?? '' },
    create: {},
    update: {} // updates lastRegistrationAt automatically 
  }))

  const latestPhase: Phase | ErrorResponse = await (await fetch(`${process.env.SERVER_URL}/api/phase/latest`, { next: { tags: ['phases'] } })).json()

  if (isErrorResponse(latestPhase) || latestPhase.status !== PhaseStatus.OPEN) return { error: "Queues not open for registration" }

  const openRegistrations = await prisma.registration.count({
    where: {
      memberId: member.id,
      phaseId: latestPhase.id,
      status: { notIn: closedRegistrationStatus }
    }
  })

  if (openRegistrations > 0) return { error: "Already registered" }

  const registrationsInPhase = await prisma.registration.count({
    where: {
      memberId: member.id,
      phaseId: latestPhase.id,
    }
  })

  const registration = await prisma.registration.create({
    data: {
      memberId: member.id,
      queueId: queue.id,
      phaseId: latestPhase.id,
      firstInPhase: registrationsInPhase === 0,
      status: RegistrationStatus.QUEUED
    }
  })

  revalidateTag('order')

  cookieStore.set("memberId", member.id)
  cookieStore.set("registrationId", String(registration.id))
  revalidateTag('registration')

  const order: Registration[] = await (await fetch(`${process.env.SERVER_URL}/api/phase/call?respectNext=false&limit=3`, { next: { tags: ['phases', 'order'] } })).json()
  const nextStatus = order.length <= 1 ? RegistrationStatus.ACTIVE : (order[1].id == registration.id ? RegistrationStatus.NEXT : RegistrationStatus.QUEUED)

  if (nextStatus === RegistrationStatus.NEXT) {
    setAsNext(registration)
  } else if (nextStatus !== RegistrationStatus.QUEUED) {
    await prisma.registration.update({
      where: { id: registration.id },
      data: { status: nextStatus }
    })
  }

  revalidateTag('order')

  return registration
}

export const dequeue = async () => {
  const cookieStore = await cookies()
  const clientRegistrationId = cookieStore.get("registrationId")?.value

  if (!clientRegistrationId) return { error: "Registration not found" }

  await prisma.registration.updateMany({
    where: {
      id: Number(clientRegistrationId),
      status: { notIn: closedRegistrationStatus }
    },
    data: { status: RegistrationStatus.WITHDRAWN }
  })

  revalidateTag('order')
}

export const goHome = async () => {
  const cookieStore = await cookies()
  cookieStore.delete("registrationId")
  revalidateTag('registration')
}