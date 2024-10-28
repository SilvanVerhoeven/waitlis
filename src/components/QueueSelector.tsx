"use client"

import { enqueue } from "@/app/actions";
import { Queue } from "@prisma/client";
import { Button, Card, Col, List, Radio, Row, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function QueueSelector({ queues, open }: { queues: Queue[], open: boolean }) {
  const [selectedQueue, setSelectedQueue] = useState<Queue>()
  const router = useRouter()

  return (
    <Card
      title="Redeliste wählen"
      actions={[
        <Row key="enqueue" style={{ padding: "0 12px" }}>
          <Col span={24}>
            <Button
              type="primary"
              disabled={selectedQueue === undefined || !open}
              block
              size="large"
              onClick={() => {
                if (!selectedQueue) return
                enqueue(selectedQueue).then(() => router.refresh())
              }}
            >
              {open ? 'Redebeitrag anmelden' : 'Redelisten sind geschlossen'}
            </Button>
          </Col>
        </Row>
      ]}>
      <List
        style={{ width: 300 }}
        dataSource={queues}
        renderItem={(queue) => (
          <List.Item
            onClick={() => setSelectedQueue(queue)}
            style={{
              display: 'flex',
              alignItems: 'start',
              backgroundColor: queue.id === selectedQueue?.id ? '#e6f7ff' : 'transparent',
              borderColor: queue.id === selectedQueue?.id ? '#1890ff' : 'transparent',
              borderWidth: 2,
              borderStyle: "solid",
              cursor: 'pointer',
              paddingLeft: 10,
              paddingRight: 10,
              borderRadius: 5,
            }}
          >
            <Radio
              checked={queue.id === selectedQueue?.id}
              onChange={() => setSelectedQueue(queue)}
            >
              <Typography>{queue.name}</Typography>
            </Radio>
          </List.Item>
        )}
      />
    </Card>
  )
}