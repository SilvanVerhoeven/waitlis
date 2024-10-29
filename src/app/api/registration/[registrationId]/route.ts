import { prisma } from '@/app/lib/db'

export async function GET(_: Request, { params: { registrationId } }: { params: { registrationId: string } }) {
  const id = Number(registrationId)
  const registration = await prisma.registration.findUnique({ where: { id: isNaN(id) ? -1 : id } })
  return Response.json(registration ?? { error: "No registration found" })
}