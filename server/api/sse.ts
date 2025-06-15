export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const role: RequestRole = session.user?.role ?? 'UNAUTHENTICATED'

  const store = getSSEStore()
  const client = event.node.res

  setResponseHeader(event, 'Content-Type', 'text/event-stream')
  setResponseHeader(event, 'Cache-Control', 'no-cache')
  setResponseHeader(event, 'Connection', 'keep-alive')

  client.write('\n') // initial newline to establish connection

  // TODO: Remove client when his role changes
  // Would receive updates with old role until page is reloaded/connection closed
  store.add(client, role)

  const keepAlive = setInterval(() => {
    client.write(': keepalive\n\n')
  }, 30000)

  event.node.req.on('close', () => {
    clearInterval(keepAlive)
    store.remove(client, role)
  })
})
