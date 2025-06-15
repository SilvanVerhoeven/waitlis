/**
 * Helper function to delay actions. Only use in development.
 *
 * @param ms Milliseconds to delay for
 */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
