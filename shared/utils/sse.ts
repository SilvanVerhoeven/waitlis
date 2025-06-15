// Extend respective type mappings (interfaces in shareed/types/sse.d.ts) when adding an event here
export const unauthenticatedSSEStoreEvents = ['CreatePhase'] as const
export const userSSEStoreEvents = [...unauthenticatedSSEStoreEvents] as const
export const managerSSEStoreEvents = ['CreateQueue', 'DeleteQueue', 'UpdateQueue', 'UpdatePhase', ...userSSEStoreEvents] as const
export const adminSSEStoreEvents = [...managerSSEStoreEvents] as const

/**
 * Returns all events sent by as server-side event for the given role.
 */
export const getSSEStoreEvents = (role: RequestRole): readonly (keyof SSEStoreEventTypeMapping)[] => {
  const mapping = {
    UNAUTHENTICATED: unauthenticatedSSEStoreEvents,
    [Role.USER]: userSSEStoreEvents,
    [Role.MANAGER]: managerSSEStoreEvents,
    [Role.ADMIN]: adminSSEStoreEvents,
  } as const

  return mapping[role]
}
