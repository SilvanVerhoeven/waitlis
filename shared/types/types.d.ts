import type { Phase as DbPhase, Queue as DbQueue, Registration as DbRegistration } from '@prisma/client'

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

  type Queue = DbQueue
  type Registration = DbRegistration
  type Phase = DbPhase
};
