"use client"

import { nextPhase } from "@/app/actions";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { FastForwardOutlined, } from '@ant-design/icons';
import Text from 'antd/es/typography/Text';

export default function NextPhaseButton() {
  const router = useRouter()

  return (
    <Button
      color="default"
      size="large"
      style={{ flexDirection: "column", height: "unset" }}
      onClick={() => {
        nextPhase(); router.refresh()
      }}>
      <FastForwardOutlined style={{ fontSize: "1.4em" }} />
      <Text style={{ color: "inherit" }}>Nächster Punkt</Text>
    </Button>
  );
}