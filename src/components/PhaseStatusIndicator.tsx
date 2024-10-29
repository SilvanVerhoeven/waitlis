import { Badge } from "antd";
import { Phase, PhaseStatus } from "@prisma/client";
import { ErrorResponse, isErrorResponse } from "@/app/lib/types";

export default async function PhaseStatusIndicator() {
  const phase: Phase | ErrorResponse = await (await fetch(`${process.env.SERVER_URL}/api/phase/latest`, { next: { tags: ['phases'] } })).json()

  return (
    <Badge status={!isErrorResponse(phase) && phase.status === PhaseStatus.OPEN ? "success" : "error"} style={{ marginRight: 5 }} />
  )
}