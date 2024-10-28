import { prisma } from "@/app/layout"

export async function GET() {
  return await prisma.phase.findFirst({ orderBy: { createdAt: "desc" } })
}