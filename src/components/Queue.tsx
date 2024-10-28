"use client"

import { setAsNext, renameQueue } from "@/app/actions"
import { QueueWithRegistrations } from "@/app/api/queue/route"
import { Registration, RegistrationStatus, type Queue } from "@prisma/client"
import { Badge, Button, Card, Input, List, Tag } from "antd"
import { ReactNode, useState } from "react"
import "../app/global.css"
import { useRouter } from "next/navigation"

type Mode = "view" | "edit"

const Queue = ({ queue, actions, defaultMode = "view" }: { defaultMode?: Mode, queue: QueueWithRegistrations, actions?: ReactNode[] }) => {
  const [mode, setMode] = useState<Mode>(defaultMode)
  const [isCallingNext, setIsCallingNext] = useState<number | undefined>()

  const router = useRouter()

  const saveName = async (newName: string) => {
    queue.name = newName
    setMode("view")
    await renameQueue(queue, newName)
  }

  const handleSetAsNext = async (registration: Registration) => {
    setIsCallingNext(registration.id)
    await setAsNext(registration)
    setIsCallingNext(undefined)
    router.refresh()
  }

  return (
    <Card
      className="queue"
      title={
        mode == "view" ?
          <div
            style={{ cursor: "pointer", color: !queue.name ? "lightgray" : "inherit" }}
            onClick={() => setMode("edit")}>{queue.name || "Unbenannt"}</div>
          :
          <Input
            placeholder="Titel"
            autoFocus
            defaultValue={queue.name}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveName(e.currentTarget.value)
              if (e.key === "Escape") setMode("view")
            }}
            onBlur={() => setMode("view")}
          />
      }
      style={{
        width: 400,
      }}
      actions={actions}>
      <List
        style={{
          maxHeight: "calc(95vh - 250px)",
          overflowY: "auto",
        }}
        size="small"
        locale={{ emptyText: "Keine Redebeiträge angemeldet" }}
        dataSource={queue.registrations}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              title={
                <>
                  <span>Anonyme Person</span>{item.firstInPhase && <Badge color="gray" style={{ marginLeft: 5 }} count="Neu" />}
                </>
              }
              description={`ID: ${item.memberId}`}
            />
            {item.status === RegistrationStatus.ACTIVE && <Tag color="green">Aufgerufen</Tag>}
            {item.status === RegistrationStatus.NEXT && <Tag color="yellow">Als Nächstes</Tag>}
            {item.status === RegistrationStatus.QUEUED && <Button
              loading={isCallingNext === item.id}
              color="primary"
              variant="text"
              onClick={() => handleSetAsNext(item)}>Als Nächstes</Button>}
          </List.Item>
        )}
      />
    </Card>
  )
}

export default Queue