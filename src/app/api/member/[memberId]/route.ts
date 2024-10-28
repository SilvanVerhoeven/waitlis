import { Registration } from "@prisma/client"
import { cookies } from 'next/headers'
import { GET as getGlobalCallOrder } from '@/app/api/phase/call/route'

export interface PhasePosition {
  position: number // position in queue. 0: it is member's turn right now
  registration: Registration
}

/**
 * Calculates position of a member across all currently open queues
 */
export async function GET(): Promise<PhasePosition | undefined> {
  const cookieStore = await cookies()
  const memberId = cookieStore.get("memberId")?.value

  if (!memberId) return

  const order = await getGlobalCallOrder({})

  const position = order.findIndex(registration => registration.memberId === memberId)

  if (position === -1) return

  return {
    position,
    registration: order[position]
  }
}