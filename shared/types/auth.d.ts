import type { Role } from '#imports'

declare module '#auth-utils' {
  interface User {
    id: string
    role: Role
  }
}

export {}
