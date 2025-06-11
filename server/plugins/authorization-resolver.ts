export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', async (event) => {
    event.context.$authorization = {
      resolveServerUser: () => {
        // Your logic to retrieve the user from the server
      },
    }
  })
})
