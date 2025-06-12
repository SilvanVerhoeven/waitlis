export {}

export interface SSEStoreTypes {
  manage: ManageSSEStoreEvents
  // Register further types of SSE stores here
}

export interface ManageSSEStoreEvents {
  UpdateQueue: Queue
  CreateQueue: Queue
  DeleteQueue: Queue
  // Register further SSE events for the Manage SSE store here
}

export type SSEClient = NodeJS.WritableStream

export interface SSENotificationResult {
  success: number
  errors: { client: SSEClient, error: Error }[]
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface GlobalSSEStore<T extends Record<string, any>> {
    clients: SSEClient[]
    add: (client: SSEClient) => void
    remove: (client: SSEClient) => void
    notify: <K extends keyof T>(event: K, data: T[K]) => SSENotificationResult
  }

  // eslint-disable-next-line no-var, vars-on-top, @typescript-eslint/no-explicit-any
  var __sseStore__: Record<SSEStoreType, GlobalSSEStore<any>>
}
