import { z } from 'zod/v4'

export const ZRegistrationInput = z.object({
  username: z.string(),
  password: z.string(),
  displayName: z.string(),
})

export const ZLoginInput = z.object({
  username: z.string(),
  password: z.string(),
})

export const ZSessionUser = z.object({
  id: z.string(),
  role: z.enum(Object.values(Role)),
})

export const ZEagerId = z.number().negative()

export const ZQueueId = z.coerce.number()

export const ZQueue = z.object({
  id: z.number(),
  name: z.string().nullable(),
  createdAt: z.coerce.date(),
})

export const ZTag = z.object({
  id: z.number(),
  name: z.string(),
})

export const ZRegistration = z.object({
  id: z.number(),
  createdAt: z.coerce.date(),
  status: z.enum(Object.values(RegistrationStatus)),
  tags: ZTag.array(),
  queueId: z.number(),
  phaseId: z.number(),
  memberId: z.string(),
})

export const ZPhaseId = z.coerce.number()

export const ZPhase = z.object({
  id: z.number(),
  name: z.string().nullable(),
  status: z.enum(Object.values(PhaseStatus)),
  isCurrent: z.boolean(),
  createdAt: z.coerce.date(),
  previousId: z.number().nullable(),
})

export const ZLane = z.object({
  id: z.number(),
  condition: z.string(),
  createdAt: z.coerce.date(),
  mergeId: z.number().nullable(),
})

export const ZUpdateLaneParams = ZLane.omit({ id: true, createdAt: true })
export const ZCreateLaneParams = ZUpdateLaneParams

export const ZUpdatePhaseParams = ZPhase.omit({ id: true, createdAt: true })
export const ZCreatePhaseParams = ZUpdatePhaseParams.extend({ id: ZEagerId })
export const ZCreatedPhase = z.object({ eagerId: ZEagerId, phase: ZPhase })

export const ZUpdateQueueParams = ZQueue.omit({ id: true, createdAt: true })
export const ZCreateQueueParams = ZUpdateQueueParams.extend({ id: ZEagerId })
export const ZCreatedQueue = z.object({ eagerId: ZEagerId, queue: ZQueue })
