/**
 * Generates an object ID to be used when creating objects eagerly.
 *
 * When creating objects (like phases and queues), an eager client-side instance should be created and stored in the local
 *   store for immediate feedback. The object should have an eager ID. It is later used to replace the eager instance by the
 *   server instance.
 *
 * The eager ID must be smaller than 0.
 */
export const generateEagerId = () => {
  return Math.ceil(Math.random() * (Number.MIN_SAFE_INTEGER + 1)) - 1
}

/**
 * Returns whether the given ID is a valid eager ID.
 */
export const isEagerId = (eagerId: number) => {
  return eagerId < 0
}
