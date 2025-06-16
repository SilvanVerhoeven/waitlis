import { RegistrationStatus } from '#imports'

export const ARCHIVED_REGISTRATION_STATUSES: RegistrationStatus[] = [
  RegistrationStatus.DECLINED,
  RegistrationStatus.HANDLED,
  RegistrationStatus.SKIPPED,
  RegistrationStatus.WITHDRAWN,
]

/**
 * Returns whether the given registration is archived, i.e. not currently waiting to speak or speaking.
 *
 * @param registration Registration to check
 * @returns True if registration does not have one of the pending statuses (QUEUED, NEXT, ACTIVE)
 */
export const isArchived = (registration: Registration) => {
  return ARCHIVED_REGISTRATION_STATUSES.includes(registration.status)
}
