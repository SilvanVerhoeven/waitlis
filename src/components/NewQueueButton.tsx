"use client"

import { Button } from "antd";
import { useRouter } from "next/navigation";
import Text from 'antd/es/typography/Text';
import { createQueue } from "@/app/actions";
import { PlusOutlined, } from '@ant-design/icons';
import { useState } from "react";

export default function CallNextButton() {
  const router = useRouter()

  const [isCreating, setIsCreating] = useState(false)

  const handleQueueCreation = async () => {
    setIsCreating(true)
    await createQueue()
    router.refresh()
    setIsCreating(false)
  }

  return (
    <Button
      className="btn-custom-large"
      loading={isCreating}
      variant="outlined"
      size="large"
      onClick={() => handleQueueCreation()}
      style={{ flexDirection: "column", height: "unset" }}>
      {!isCreating && <PlusOutlined style={{ fontSize: "1.4em" }} />}
      <Text style={{ color: "inherit" }}>Hinzufügen</Text>
    </Button>
  );
}