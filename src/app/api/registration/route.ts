import { cookies } from 'next/headers'
import { prisma } from "@/app/layout"

export async function GET() {
  const cookieStore = await cookies()
  const registrationId = cookieStore.get("registrationId")?.value

  if (!registrationId) return

  return await prisma.registration.findUnique({ where: { id: Number(registrationId) } })
}