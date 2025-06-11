/**
 * Returns the appropriate entrypoint for a user after login/registration.
 *
 * @param sessionUser User's session data returned from login/registration route
 * @returns Entrypoint to navigate user to
 */
export const getEntryPoint = (sessionUser: SessionUser) => {
  const managerRoles: Role[] = [Role.ADMIN, Role.MANAGER]
  return managerRoles.includes(sessionUser.role) ? '/manage' : '/'
}
