import type { Lane as DbLane, Member as DbMember, Phase as DbPhase, Queue as DbQueue, Registration as DbRegistration, Role as DbRole, Tag as DbTag, User as DbUser } from '@prisma/client'

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

  type User = DbUser
  type Member = DbMember
  type Tag = DbTag
  type Queue = DbQueue
  type Registration = DbRegistration & { tags: Tag[] }
  type Lane = DbLane
  type Phase = DbPhase
  type Role = DbRole

  type UpdateLaneParams = z.infer<typeof ZUpdateLaneParams>
  type CreateLaneParams = z.infer<typeof ZCreateLaneParams>

  type UpdateRegistrationParams = z.infer<typeof ZUpdateRegistrationParams>
  type CreateRegistrationParams = z.infer<typeof ZCreateRegistrationParams>
  type CreateRegistrationResult = z.infer<typeof ZCreateRegistrationResult>

  type UpdatePhaseParams = z.infer<typeof ZUpdatePhaseParams>
  type CreatePhaseParams = z.infer<typeof ZCreatePhaseParams>

  type UpdateQueueParams = z.infer<typeof ZUpdateQueueParams>
  type CreateQueueParams = z.infer<typeof ZCreateQueueParams>
}
