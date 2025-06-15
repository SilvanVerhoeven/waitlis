import type { SSEStoreEvent } from '~/shared/types/sse'
import { defineStore } from 'pinia'

export const useSSEStore = defineStore('sse', {
  state: () => ({
    _sse: undefined as EventSource | undefined,
    _abortControllers: [] as AbortController[],
  }),

  getters: {
    sse: state => state._sse,
  },

  actions: {
    async initialize() {
      if (import.meta.client && !this._sse) {
        this._sse = new EventSource('/api/sse')
      }
    },

    /**
     * Starts listening for the given event. The given handler consumes the received event data.
     *
     * Returns an `AbortController` to stop listening for the event. Should be called before calling this registration method
     * with the same values again to prevent multiple identical handlers.
     *
     * @param event Event to start listening for
     * @param handler Consumes and handles data received on `event`
     * @returns `AbortController` to stop listening
     */
    async register<E extends SSEStoreEvent>(
      event: E,
      handler: (
        data: SSEStoreEventTypeMapping[E],
        e: MessageEvent<E>
      ) => void | Promise<void>,
    ) {
      if (!this._sse) {
        throw new Error('Cannot register event handler now. SSE store has to be initialized first')
      }

      const controller = new AbortController()

      this._sse.addEventListener(event, (e) => {
        const parsedData = JSON.parse(e.data)
        handler(parsedData, e)
      }, { signal: controller.signal })

      this._abortControllers.push(controller)

      return controller
    },

    teardown() {
      this._abortControllers.forEach(controller => controller.abort())
      this._sse?.close()
    },
  },
})
