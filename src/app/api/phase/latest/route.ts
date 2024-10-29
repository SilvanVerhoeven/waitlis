import { prisma } from "@/app/lib/db";

export async function GET() {
  return Response.json((await prisma.phase.findFirst({ orderBy: { createdAt: "desc" } })) ?? { error: "No phase" })
}