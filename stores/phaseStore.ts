import { defineStore } from 'pinia'

export const usePhaseStore = defineStore('phases', {
  state: () => ({
    phases: [] as Phase[], // no particular order
    isTogglingStatus: false,
  }),

  getters: {
    isValidState: state => state.phases.filter(phase => phase.isCurrent).length === 1,

    hasPreviousPhase(): boolean {
      return this.current.previousId !== null
    },

    current(state) {
      const currentPhase = state.phases.find(phase => phase.isCurrent)
      if (!currentPhase) throw silent(new Error('Invalid store state: No current phase'))
      return currentPhase
    },
  },

  actions: {
    async initialize() {
      await this.refresh()

      const sseStore = useSSEStore()

      sseStore.register('CreatePhase', (data) => {
        try {
          const { eagerId, phase: newPhase } = ZCreatedPhase.parse(data)
          const replaceIndex = this.phases.findIndex(p => p.id === eagerId)
          if (replaceIndex < 0) {
            this.phases.push(newPhase)
            return
          }
          const mergedPhase: Phase = {
            ...newPhase,
            isCurrent: this.phases[replaceIndex]?.isCurrent ?? newPhase.isCurrent,
            name: this.phases[replaceIndex]?.name ?? newPhase.name,
            status: this.phases[replaceIndex]?.status ?? newPhase.status,
            // previous ID should be updated, it is not set locally on the eager phase
          }
          this.phases[replaceIndex] = mergedPhase
          this._updatePhase(newPhase, mergedPhase)
        }
        catch (e) {
          throw silent(e as Error)
        }
      })

      sseStore.register('UpdatePhase', (data) => {
        try {
          const phase = ZPhase.parse(data)
          const index = this.phases.findIndex(q => q.id === phase.id)
          if (index < 0) return
          this.phases[index] = phase
        }
        catch (e) {
          throw silent(e as Error)
        }
      })
    },

    async refresh() {
      const rawPhases = await $fetch('/api/phase')
      const phases = ZPhase.array().parse(rawPhases)
      this.phases = phases
    },

    async createPhase({ eagerId, name, previousId, isCurrent: setAsCurrentPhase = true, status = 'CLOSED' }: CreatePhaseParams) {
      const eagerPhase: Phase = { id: eagerId, createdAt: new Date(), name, isCurrent: setAsCurrentPhase, status, previousId }
      if (setAsCurrentPhase) this.current.isCurrent = false
      this.phases.push(eagerPhase)

      try {
        await $fetch('/api/phase', { method: 'POST', body: eagerPhase })
      }
      catch (e) {
        const deleteIndex = this.phases.findIndex(p => p.id === eagerPhase.id)
        this.phases.splice(deleteIndex, 1)
        throw e
      }
    },

    async setAsCurrent(phase: Phase) {
      this.current.isCurrent = false
      await this._updatePhase({ ...phase }, { ...phase, isCurrent: true })
      // Make sure to get into a valid state again - if it causes issues down the line, debouncing database operations might be a good idea
      this.phases.filter(p => p.isCurrent && p.id !== phase.id).map(p => p.isCurrent = false)
    },

    async previousPhase() {
      const previousPhase = this.phases.find(phase => phase.id === this.current.previousId)
      if (previousPhase) await this.setAsCurrent(previousPhase)
    },

    async nextPhase() {
      const nextPhase = this.phases.find(phase => phase.previousId === this.current.id)
      if (nextPhase) {
        await this.setAsCurrent(nextPhase)
        return
      }
      await this.createPhase({ eagerId: generateEagerId(), status: 'OPEN', isCurrent: true, name: null, previousId: null })
    },

    // async deleteQueue(queue: Queue) {
    //   const eagerIndex = this.queues.findIndex(q => q.id === queue.id && q.createdAt === queue.createdAt)
    //   this.queues.splice(eagerIndex, 1)

    //   try {
    //     await $fetch(`/api/queue/${queue.id}`, { method: 'DELETE' })
    //   }
    //   catch (e) {
    //     console.error(e)
    //     this.queues.push(queue)
    //   }
    // },

    async _updatePhase(oldPhase: Phase, newPhase: Phase) {
      const eagerPhaseIndex = this.phases.findIndex(p => p.id === newPhase.id)
      if (eagerPhaseIndex >= 0) this.phases[eagerPhaseIndex] = newPhase

      if (isEagerId(newPhase.id)) return // skip DB update for eager phases

      try {
        await $fetch(`/api/phase/${oldPhase.id}`, { method: 'POST', body: newPhase })
      }
      catch (e) {
        const queueIndex = this.phases.findIndex(p => p.id === newPhase.id)
        this.phases[queueIndex] = oldPhase
        throw e
      }
    },

    async renamePhase(phase: Phase, newName: Phase['name']) {
      await this._updatePhase({ ...phase }, { ...phase, name: newName })
    },

    async setPhaseStatus(phase: Phase, newStatus: Phase['status']) {
      await this._updatePhase({ ...phase }, { ...phase, status: newStatus })
    },

    async toggleCurrentPhaseStatus() {
      this.isTogglingStatus = true
      try {
        await this.setPhaseStatus(this.current, this.current.status === 'OPEN' ? 'CLOSED' : 'OPEN')
      }
      finally {
        this.isTogglingStatus = false
      }
    },

    // /**
    //  * Persists phase name only in store, not in database.
    //  * E.g. allows user to edit the name of an eagerly created queue before that queue has been fully created in the database.
    //  */
    // persistNameInStore(queue: Queue, name: Queue['name']) {
    //   const queueIndex = this.queues.findIndex(q => q.id === queue.id && q.createdAt === queue.createdAt)
    //   if (!this.queues[queueIndex]) return
    //   this.queues[queueIndex].name = name
    // },
  },
})
