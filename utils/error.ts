/**
 * Returns an error that will be logged but not shown to the user.
 *
 * @param error Error to be thrown silently
 * @return Silent Error that can be thrown
 */
export const silent = (error: Error) => {
  error.name = `[silent] ${error.name}`
  return error
}
