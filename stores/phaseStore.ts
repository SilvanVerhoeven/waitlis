import type { CreatePhaseParams } from '~/server/api/phase/index.post'
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
      if (!currentPhase) throw new Error('Invalid store state: No current phase')
      return currentPhase
    },
  },

  actions: {
    async initialize() {
      await this.refresh()
    },

    async refresh() {
      try {
        const rawPhases = await $fetch('/api/phase')
        const phases = ZPhase.array().parse(rawPhases)
        this.phases = phases
      }
      catch (e) {
        console.error(e)
      }
    },

    async createPhase({ name, previousId, isCurrent: setAsCurrentPhase = true, status = 'CLOSED' }: CreatePhaseParams) {
      const eagerPhase: Phase = { id: -1, createdAt: new Date(), name, isCurrent: setAsCurrentPhase, status, previousId }
      if (setAsCurrentPhase) this.current.isCurrent = false
      this.phases.push(eagerPhase)

      try {
        const params: CreatePhaseParams = { name, isCurrent: setAsCurrentPhase, previousId, status }
        const rawNewPhase = await $fetch('/api/phase', { method: 'POST', body: params })
        const newPhase = ZPhase.parse(rawNewPhase)
        const replaceIndex = this.phases.findIndex(p => p.id === eagerPhase.id && p.createdAt === eagerPhase.createdAt)
        const replacePhase = this.phases[replaceIndex]
        if (!replacePhase) throw new Error('Expected phase replacement not found')
        this.phases.splice(replaceIndex, 1, newPhase)
        let finalPhase = newPhase
        if (
          newPhase.name !== replacePhase.name
          || newPhase.status !== replacePhase.status
          || newPhase.isCurrent !== replacePhase.isCurrent
        ) {
          finalPhase = {
            ...newPhase,
            name: replacePhase.name,
            status: replacePhase.status,
            isCurrent: replacePhase.isCurrent,
          }
          await this._updatePhase(newPhase, finalPhase)
        }
      }
      catch (e) {
        console.error(e)
        const deleteIndex = this.phases.findIndex(p => p.id === eagerPhase.id && p.createdAt === eagerPhase.createdAt)
        this.phases.splice(deleteIndex, 1)
      }
    },

    async setAsCurrent(phase: Phase) {
      this.current.isCurrent = false
      await this._updatePhase({ ...phase }, { ...phase, isCurrent: true })
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
      await this.createPhase({ status: 'OPEN', isCurrent: true, name: null, previousId: null })
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
      const eagerPhaseIndex = this.phases.findIndex(p => p.id === oldPhase.id)
      if (eagerPhaseIndex >= 0) this.phases[eagerPhaseIndex] = newPhase

      if (newPhase.id === -1) return // skip DB update for eager phases

      try {
        const rawUpdatedPhase = await $fetch(`/api/phase/${oldPhase.id}`, { method: 'POST', body: newPhase })
        const updatedPhase = ZPhase.parse(rawUpdatedPhase)
        const phaseIndex = this.phases.findIndex(p => p.id === updatedPhase.id)
        if (phaseIndex < 0) throw new Error('Invalid phase ID after update')
        this.phases[phaseIndex] = updatedPhase
      }
      catch (e) {
        console.error(e)
        const queueIndex = this.phases.findIndex(p => p.id === oldPhase.id)
        this.phases[queueIndex] = oldPhase
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
      await this.setPhaseStatus(this.current, this.current.status === 'OPEN' ? 'CLOSED' : 'OPEN')
      this.isTogglingStatus = false
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
