import { prisma } from "@/app/lib/db"
import { Registration } from "@prisma/client"

export const dynamic = "force-dynamic"

/**
 * Returns all queues with their registrations
 */
export async function GET() {
  const registrations: Registration[] = await (await fetch(`${process.env.SERVER_URL}/api/phase/call`, { next: { tags: ['phases', 'order'] } })).json()

  return Response.json((await prisma.queue.findMany())
    .map(queue => {
      return {
        ...queue,
        registrations: registrations.filter(registration => registration.queueId === queue.id)
      }
    }))
}