import { updateSessionUser } from '../utils/session'

export default defineNitroPlugin(() => {
  sessionHooks.hook('fetch', async (session, event) => {
    await updateSessionUser(event)
  })
})
