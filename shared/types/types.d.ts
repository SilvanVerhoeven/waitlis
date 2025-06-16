import type { Lane as DbLane, Phase as DbPhase, Queue as DbQueue, Registration as DbRegistration, Role as DbRole, Tag as DbTag } from '@prisma/client'

export {}

declare global {
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

  type Tag = DbTag
  type Queue = DbQueue
  type Registration = DbRegistration & { tags: Tag[] }
  type Lane = DbLane
  type Phase = DbPhase
  type Role = DbRole

  type UpdateLaneParams = z.infer<typeof ZUpdateLaneParams>
  type CreateLaneParams = z.infer<typeof ZCreateLaneParams>

  type UpdatePhaseParams = z.infer<typeof ZUpdatePhaseParams>
  type CreatePhaseParams = z.infer<typeof ZCreatePhaseParams>

  type UpdateQueueParams = z.infer<typeof ZUpdateQueueParams>
  type CreateQueueParams = z.infer<typeof ZCreateQueueParams>
}
