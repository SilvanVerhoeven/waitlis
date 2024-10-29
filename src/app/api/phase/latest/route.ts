import { prisma } from "@/app/lib/db";

export const dynamic = "force-dynamic"

export async function GET() {
  return Response.json((await prisma.phase.findFirst({ orderBy: { createdAt: "desc" } })) ?? { error: "No phase" })
}