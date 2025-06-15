const initSSEStore = () => {
  const store: GlobalSSEStore = {
    clients: {
      ADMIN: [],
      MANAGER: [],
      USER: [],
      UNAUTHENTICATED: [],
    },

    add(client, role) {
      this.clients[role].push(client)
    },

    remove(client, role) {
      const _role = role ?? Object.keys(this.clients).find(r => this.clients[r as RequestRole].includes(client)) as RequestRole | undefined
      if (!_role) return
      this.clients[_role] = this.clients[_role].filter(c => c !== client)
    },

    notify(event, data) {
      const payload = `event: ${String(event)}\ndata: ${JSON.stringify(data)}\n\n`

      const result: SSENotificationResult = {
        success: 0,
        errors: [],
      }

      for (const _role in this.clients) {
        const role = _role as Role

        if (!getSSEStoreEvents(role).includes(event)) continue

        this.clients[role].forEach((client) => {
          try {
            client.write(payload)
            result.success++
          }
          catch (error) {
            result.errors.push({ client, error: error as Error })
          }
        })
      }

      return result
    },
  }

  return store
}

if (!globalThis.__sseStore__) {
  globalThis.__sseStore__ = initSSEStore()
}

export const getSSEStore = () => globalThis.__sseStore__
