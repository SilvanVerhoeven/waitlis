export default defineNuxtRouteMiddleware((to) => {
  if (to.meta.isPublic) return

  const { loggedIn } = useUserSession()

  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})
