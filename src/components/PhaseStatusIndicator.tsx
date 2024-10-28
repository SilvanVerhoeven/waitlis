import { Badge } from "antd";
import { GET as getLatestPhase } from "@/app/api/phase/latest/route"
import { PhaseStatus } from "@prisma/client";

export default async function PhaseStatusIndicator() {
  const phase = await getLatestPhase()

  return (
    <Badge status={phase?.status === PhaseStatus.OPEN ? "success" : "error"} style={{ marginRight: 5 }} />
  )
}