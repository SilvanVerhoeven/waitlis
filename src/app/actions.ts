"use server"

import { cookies } from 'next/headers'
import { PhaseStatus, Queue, Registration, RegistrationStatus } from "@prisma/client"
import { POST as newQueue } from "./api/queue/route"
import { POST as createPhase } from "./api/phase/route"
import { GET as getLatestPhase } from "./api/phase/latest/route"
import { prisma } from './layout'
import { closedRegistrationStatus, GET as getGlobalCallOrder } from './api/phase/call/route'

export const renameQueue = async (queue: Queue, newName: string) => {
  return await prisma.queue.update({
    where: { id: queue.id },
    data: { name: newName }
  })
}

export const createQueue = async () => {
  return (await newQueue()).json()
}

export const nextPhase = async () => {
  await setPhaseStatus(PhaseStatus.CLOSED)
  return await createPhase()
}

export const setPhaseStatus = async (status: PhaseStatus) => {
  const phase = await getLatestPhase()
  if (!phase) return { error: "No phase available. Create a phase first" }
  await prisma.phase.update({
    where: { id: phase.id },
    data: { status }
  })
}

export const togglePhaseStatus = async () => {
  const phase = await getLatestPhase()
  if (!phase) return { error: "No phase available. Create a phase first" }
  await prisma.phase.update({
    where: { id: phase.id },
    data: { status: phase.status === PhaseStatus.CLOSED ? PhaseStatus.OPEN : PhaseStatus.CLOSED }
  })
}

export const callNext = async () => {
  await prisma.registration.updateMany({
    where: { status: RegistrationStatus.ACTIVE },
    data: { status: RegistrationStatus.HANDLED }
  })

  const order = await getGlobalCallOrder({})

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
}

export const enqueue = async (queue: Queue) => {
  const cookieStore = await cookies()

  const clientMemberId = cookieStore.get("memberId")?.value

  const member = (await prisma.member.upsert({
    where: { id: clientMemberId ?? '' },
    create: {},
    update: {} // updates lastRegistrationAt automatically 
  }))

  const latestPhase = await getLatestPhase()

  if (!latestPhase || latestPhase.status !== PhaseStatus.OPEN) return { error: "Queues not open for registration" }

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

  cookieStore.set("memberId", member.id)
  cookieStore.set("registrationId", String(registration.id))

  const order = await getGlobalCallOrder({ respectNext: false, limit: 3 })
  const nextStatus = order.length <= 1 ? RegistrationStatus.ACTIVE : (order[1].id == registration.id ? RegistrationStatus.NEXT : RegistrationStatus.QUEUED)

  if (nextStatus === RegistrationStatus.NEXT) {
    setAsNext(registration)
  } else if (nextStatus !== RegistrationStatus.QUEUED) {
    await prisma.registration.update({
      where: { id: registration.id },
      data: { status: nextStatus }
    })
  }

  return registration
}

export const dequeue = async () => {
  const cookieStore = await cookies()

  const clientMemberId = cookieStore.get("memberId")?.value

  const member = (await prisma.member.findUnique({
    where: { id: clientMemberId ?? '' }
  }))

  if (!member) return

  const latestPhase = await getLatestPhase()

  if (!latestPhase || latestPhase.status !== PhaseStatus.OPEN) return { error: "No open queue found" }

  await prisma.registration.updateMany({
    where: {
      memberId: member.id,
      phaseId: latestPhase.id,
      status: { notIn: closedRegistrationStatus }
    },
    data: { status: RegistrationStatus.WITHDRAWN }
  })
}

export const goHome = async () => {
  const cookieStore = await cookies()
  cookieStore.delete("registrationId")
}