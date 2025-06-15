import type { Phase as DbPhase, Queue as DbQueue, Registration as DbRegistration, Role as DbRole } from '@prisma/client'

export {}

declare global{
  interface RegistrationInput {
    username: string
    password: string
    displayName: string
  }

  interface LoginInput {
    username: string
    password: string
  }

  interface SessionUser {
    id: string
    role: Role
  }

  type Queue = DbQueue
  type Registration = DbRegistration
  type Phase = DbPhase
  type Role = DbRole

  type UpdatePhaseParams = z.infer<typeof ZUpdatePhaseParams>
  type CreatePhaseParams = z.infer<typeof ZCreatePhaseParams>

  type UpdateQueueParams = z.infer<typeof ZUpdateQueueParams>
  type CreateQueueParams = z.infer<typeof ZCreateQueueParams>
}
