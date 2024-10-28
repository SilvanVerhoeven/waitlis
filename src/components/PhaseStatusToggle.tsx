"use client"

import { Segmented } from "antd";
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { togglePhaseStatus } from "@/app/actions";
import { useRouter } from "next/navigation";
import { PhaseStatus } from "@prisma/client";
import { useState } from "react";

export default function PhaseStatusToggle({ status, disabled }: { disabled: boolean, status: PhaseStatus }) {
  const router = useRouter()

  const [isToggling, setIsToggling] = useState(false)

  const handleToggle = async () => {
    setIsToggling(true)
    await togglePhaseStatus()
    setIsToggling(false)
    router.refresh()
  }

  return (
    <Segmented
      disabled={disabled || isToggling}
      options={[
        {
          label: (
            <div style={{ padding: 4 }}>
              <LockOutlined />
              <div>Geschlossen</div>
            </div>
          ),
          value: 'closed',
        },
        {
          label: (
            <div style={{ padding: 4 }}>
              <UnlockOutlined />
              <div>Geöffnet</div>
            </div>
          ),
          value: 'open',
        },
      ]}
      value={status === PhaseStatus.CLOSED ? 'closed' : 'open'}
      onChange={() => handleToggle()}
    />
  )
}