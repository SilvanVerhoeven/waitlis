import { defineStore } from 'pinia'

export const useQueueStore = defineStore('queues', {
  state: () => ({
    queues: [] as Queue[],
    _abortControllers: [] as AbortController[],
  }),

  actions: {
    _updateQueue(queue: Queue) {
      const index = this.queues.findIndex(q => q.id === queue.id)
      if (index < 0) return
      this.queues[index] = queue
    },

    async initialize() {
      await this.refresh()

      const sseStore = useSSEStore()

      sseStore.register('UpdateQueue', (data) => {
        try {
          this._updateQueue(ZQueue.parse(data))
        }
        catch (e) {
          throw silent(e as Error)
        }
      })

      sseStore.register('CreateQueue', (data) => {
        try {
          const { eagerId, queue: newQueue } = ZCreatedQueue.parse(data)
          const replaceIndex = this.queues.findIndex(q => q.id === eagerId)
          if (replaceIndex < 0) {
            this.queues.push(newQueue)
            return
          }
          const mergedQueue: Queue = {
            ...newQueue,
            name: this.queues[replaceIndex]?.name ?? newQueue.name,
          }
          this.queues[replaceIndex] = mergedQueue
        }
        catch (e) {
          throw silent(e as Error)
        }
      })

      sseStore.register('DeleteQueue', (data) => {
        try {
          const deleteQueue = ZQueue.parse(data)
          this.queues = this.queues.filter(q => q.id !== deleteQueue.id)
        }
        catch (e) {
          throw silent(e as Error)
        }
      })
    },

    async refresh() {
      const rawQueues = await $fetch('/api/queue')
      const queues = ZQueue.array().parse(rawQueues)
      this.queues = queues
    },

    teardown() {
      this._abortControllers.forEach(controller => controller.abort())
    },

    async callNext() {

    },

    async createQueue(name?: string) {
      const eagerQueue: Queue = { id: generateEagerId(), name: name ?? null, createdAt: new Date() }
      this.queues.push(eagerQueue)

      try {
        await $fetch('/api/queue', { method: 'POST', body: eagerQueue })
      }
      catch (e) {
        const deleteIndex = this.queues.findIndex(q => q.id === eagerQueue.id && q.createdAt === eagerQueue.createdAt)
        this.queues.splice(deleteIndex, 1)
        throw (e)
      }
    },

    async deleteQueue(queue: Queue) {
      const eagerIndex = this.queues.findIndex(q => q.id === queue.id && q.createdAt === queue.createdAt)
      this.queues.splice(eagerIndex, 1)

      try {
        await $fetch(`/api/queue/${queue.id}`, { method: 'DELETE' })
      }
      catch (e) {
        this.queues.push(queue)
        throw e
      }
    },

    async renameQueue(queue: Queue, newName: Queue['name']) {
      const oldQueue = { ...queue }
      const newQueue = { ...queue, name: newName }

      const eagerQueueIndex = this.queues.findIndex(q => q.id === queue.id)
      if (eagerQueueIndex >= 0) this.queues[eagerQueueIndex] = newQueue

      if (newQueue.id === -1) return // skip DB update for eager queues

      try {
        await $fetch(`/api/queue/${queue.id}`, { method: 'POST', body: newQueue })
      }
      catch (e) {
        const queueIndex = this.queues.findIndex(q => q.id === oldQueue.id)
        this.queues[queueIndex] = oldQueue
        throw e
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
