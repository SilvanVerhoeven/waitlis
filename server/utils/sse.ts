if (!globalThis.__sseStore__) {
  globalThis.__sseStore__ = {}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initSSEStore = <T extends Record<string, any>>(id: keyof SSEStoreTypes) => {
  globalThis.__sseStore__[id] = {
    clients: [],

    add(client) {
      this.clients.push(client)
    },

    remove(client) {
      this.clients = this.clients.filter(c => c !== client)
    },

    notify(event, data) {
      const payload = `event: ${String(event)}\ndata: ${JSON.stringify(data)}\n\n`

      const result: SSENotificationResult = {
        success: 0,
        errors: [],
      }

      this.clients.forEach((client) => {
        try {
          client.write(payload)
          result.success++
        }
        catch (error) {
          result.errors.push({ client, error: error as Error })
        }
      })

      return result
    },
  }

  return globalThis.__sseStore__[id] as GlobalSSEStore<T>
}

export const getSSEStore = <T extends keyof SSEStoreTypes>(type: T) => globalThis.__sseStore__[type] as GlobalSSEStore<SSEStoreTypes[T]> || initSSEStore<SSEStoreTypes[T]>(type)
