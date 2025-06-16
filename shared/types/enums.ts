export { PhaseStatus, RegistrationStatus, Role } from '@prisma/client'

export enum COOKIE_IDS {
  MEMBER_ID = 'WAITLIS_MEMBER_ID',
  MEMBER_SECRET = 'WAITLIS_MEMBER_SECRET',
}

export enum SYSTEM_TAG_IDS {
  FIRST_REGISTRATION_IN_PHASE = 1,
}
