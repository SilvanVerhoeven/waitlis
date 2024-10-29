import { Registration } from "@prisma/client"

export interface PhasePosition {
  position: number // position in queue. 0: it is member's turn right now
  registration: Registration
}

/**
 * Calculates position of a member across all currently open queues
 */
export async function GET(_: Request, { params: { memberId } }: { params: { memberId: string } }) {
  const order: Registration[] = await (await fetch(`${process.env.SERVER_URL}/api/phase/call`, { next: { tags: ['phases', 'order'] } })).json()

  const position = order.findIndex(registration => registration.memberId === memberId)

  if (position === -1) return Response.json({ error: "No position" })

  return Response.json({
    position: position + 1,
    registration: order[position]
  })
}