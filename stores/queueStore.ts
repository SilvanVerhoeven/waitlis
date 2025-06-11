import { defineStore } from 'pinia'

export const useQueueStore = defineStore('queues', {
  state: () => ({ queues: [] as Queue[] }),

  actions: {
    async initialize() {
      await this.refresh()
    },

    async refresh() {
      try {
        const rawQueues = await $fetch('/api/queue')
        const queues = ZQueue.array().parse(rawQueues)
        this.queues = queues
      }
      catch (e) {
        console.error(e)
      }
    },

    async callNext() {

    },

    async createQueue(name?: string) {
      const eagerQueue: Queue = { id: -1, name: name ?? null, createdAt: new Date() }
      this.queues.push(eagerQueue)

      try {
        const rawNewQueue = await $fetch('/api/queue', { method: 'POST', body: { name: name ?? null } })
        const newQueue = ZQueue.parse(rawNewQueue)
        const replaceIndex = this.queues.findIndex(q => q.id === eagerQueue.id && q.createdAt === eagerQueue.createdAt)
        const replaceQueue = this.queues[replaceIndex]
        if (!replaceQueue) throw new Error('Expected queue replacement not found')
        this.queues.splice(replaceIndex, 1, newQueue)
        if (newQueue.name !== replaceQueue.name) this.renameQueue(newQueue, replaceQueue.name)
      }
      catch (e) {
        console.error(e)
        const deleteIndex = this.queues.findIndex(q => q.id === eagerQueue.id && q.createdAt === eagerQueue.createdAt)
        this.queues.splice(deleteIndex, 1)
      }
    },

    async deleteQueue(queue: Queue) {
      const eagerIndex = this.queues.findIndex(q => q.id === queue.id && q.createdAt === queue.createdAt)
      this.queues.splice(eagerIndex, 1)

      try {
        await $fetch(`/api/queue/${queue.id}`, { method: 'DELETE' })
      }
      catch (e) {
        console.error(e)
        this.queues.push(queue)
      }
    },

    async renameQueue(queue: Queue, newName: Queue['name']) {
      const oldQueue = { ...queue }
      const newQueue = { ...queue, name: newName }

      const eagerQueueIndex = this.queues.findIndex(q => q.id === queue.id)
      if (eagerQueueIndex >= 0) this.queues[eagerQueueIndex] = newQueue

      if (newQueue.id === -1) return // skip DB update for eager queues

      try {
        const rawUpdatedQueue = await $fetch(`/api/queue/${queue.id}`, { method: 'POST', body: newQueue })
        const updatedQueue = ZQueue.parse(rawUpdatedQueue)
        const queueIndex = this.queues.findIndex(q => q.id === updatedQueue.id)
        if (queueIndex < 0) throw new Error('Invalid queue ID after update')
        this.queues[queueIndex] = updatedQueue
      }
      catch (e) {
        console.error(e)
        const queueIndex = this.queues.findIndex(q => q.id === oldQueue.id)
        this.queues[queueIndex] = oldQueue
      }
    },

    /**
     * Persists queue name only in store, not in database.
     * E.g. allows user to edit the name of an eagerly created queue before that queue has been fully created in the database.
     */
    persistNameInStore(queue: Queue, name: Queue['name']) {
      const queueIndex = this.queues.findIndex(q => q.id === queue.id && q.createdAt === queue.createdAt)
      if (!this.queues[queueIndex]) return
      this.queues[queueIndex].name = name
    },
  },
})
