export {}

// Extend getSSEStoreEvents() when adding a role here
export type RequestRole = Role | 'UNAUTHENTICATED'

// type UnauthorizedSSEStoreEvent = typeof unauthorizedSSEStoreEvents[number]
// type ManagerSSEStoreEvent = typeof managerSSEStoreEvents[number]
// type AdminSSEStoreEvent = typeof adminSSEStoreEvents[number]

// export interface SSEStoreEvent {
//   [Role.ADMIN]: AdminSSEStoreEvent
//   [Role.MANAGER]: ManagerSSEStoreEvent
//   [Role.USER]: UnauthorizedSSEStoreEvent
// }

// export type RolesForSSEEvent<E extends keyof SSEStoreEventTypeMapping> = {
//   [R in Role]: E extends SSEStoreEvent[R] ? R : never;
// }[Role]

export type SSEStoreEvent = typeof adminSSEStoreEvents[number]

export interface UnauthenticatedSSEStoreEventTypeMapping {
  CurrentPhase: Phase
  UpdateQueue: Queue
  CreateQueue: Queue
  DeleteQueue: Queue
  // Register further SSE events for the Unauthenticated SSE store here. Add to UnauthenticatedSSEStoreEvents array
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserSSEStoreEventTypeMapping extends UnauthenticatedSSEStoreEventTypeMapping {
  // Register further SSE events for the User SSE store here. Add to UserSSEStoreEvents array
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ManagerSSEStoreEventTypeMapping extends UserSSEStoreEventTypeMapping {
  // Register further SSE events for the Manager SSE store here. Add to ManagerSSEStoreEvents array
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AdminSSEStoreEventTypeMapping extends ManagerSSEStoreEventTypeMapping {
  // Register further SSE events for the Admin SSE store here. Add to AdminSSEStoreEvents array
}

export type SSEStoreEventTypeMapping = AdminSSEStoreEventTypeMapping

export type SSEClient = NodeJS.WritableStream

export interface SSENotificationResult {
  success: number
  errors: { client: SSEClient, error: Error }[]
}

declare global {
  interface GlobalSSEStore {
    clients: Record<RequestRole, SSEClient[]>
    add: (client: SSEClient, role: RequestRole) => void
    remove: (client: SSEClient, role?: RequestRole) => void
    notify: <E extends SSEStoreEvent>(event: E, data: SSEStoreEventTypeMapping[E]) => SSENotificationResult
  }

  // eslint-disable-next-line no-var, vars-on-top
  var __sseStore__: GlobalSSEStore
}
