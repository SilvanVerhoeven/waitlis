import authorize from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await authorize(event, Role.MANAGER)

  const store = getSSEStore('manage')
  const client = event.node.res

  setResponseHeader(event, 'Content-Type', 'text/event-stream')
  setResponseHeader(event, 'Cache-Control', 'no-cache')
  setResponseHeader(event, 'Connection', 'keep-alive')

  client.write('\n') // initial newline to establish connection

  store.add(client)

  const keepAlive = setInterval(() => {
    client.write(': keepalive\n\n')
  }, 30000)

  event.node.req.on('close', () => {
    clearInterval(keepAlive)
    store.remove(client)
  })
})
