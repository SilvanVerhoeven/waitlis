"use client"

import { Button } from "antd";
import { useRouter } from "next/navigation";
import Text from 'antd/es/typography/Text';
import { callNext } from "@/app/actions";
import { StepForwardOutlined, } from '@ant-design/icons';
import { useState } from "react";

export default function CallNextButton({ disabled = false }: { disabled: boolean }) {
  const router = useRouter()

  const [isCallingNext, setIsCallingNext] = useState(false)

  const handleCallNext = async () => {
    setIsCallingNext(true)
    await callNext()
    router.refresh()
    setIsCallingNext(false)
  }

  return (
    <Button
      className="btn-custom-large"
      loading={isCallingNext}
      disabled={disabled}
      color="primary"
      variant="outlined"
      size="large"
      onClick={() => handleCallNext()}
      style={{ flexDirection: "column", height: "unset" }}>
      {!isCallingNext && <StepForwardOutlined style={{ fontSize: "1.4em" }} />}
      <Text style={{ color: "inherit" }}>Nächste Person</Text>
    </Button>
  );
}