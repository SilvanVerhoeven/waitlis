"use client"

import { nextPhase } from "@/app/actions";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { FastForwardOutlined, } from '@ant-design/icons';
import Text from 'antd/es/typography/Text';
import { useState } from "react";

export default function NextPhaseButton() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    await nextPhase()
    router.refresh()
    setIsLoading(false)
  }

  return (
    <Button
      className="btn-custom-large"
      color="default"
      size="large"
      style={{ flexDirection: "column", height: "unset" }}
      onClick={handleClick}
      loading={isLoading}
    >
      {!isLoading && <FastForwardOutlined style={{ fontSize: "1.4em" }} />}
      <Text style={{ color: "inherit" }}>Nächster Punkt</Text>
    </Button>
  );
}