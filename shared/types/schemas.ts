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

export const ZQueueId = z.coerce.number()

export const ZQueue = z.object({
  id: z.number(),
  name: z.string().nullable(),
  createdAt: z.coerce.date(),
})

export const ZRegistration = z.object({
  id: z.number(),
  createdAt: z.coerce.date(),
  status: z.enum(Object.values(RegistrationStatus)),
  firstInPhase: z.boolean(),
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
