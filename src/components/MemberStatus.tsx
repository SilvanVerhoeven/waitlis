"use client"

import { Button, Card, Col, Row } from "antd"
import { AudioOutlined, CheckCircleOutlined, FastForwardOutlined, HourglassOutlined, MessageOutlined, StopOutlined, UndoOutlined } from '@ant-design/icons';
import "../app/global.css"
import { PhasePosition } from "@/app/api/member/[memberId]/route";
import Text from 'antd/es/typography/Text';
import Title from 'antd/es/typography/Title';
import { ReactElement, ReactNode, useState } from "react";
import { RegistrationStatus } from "@prisma/client";
import { dequeue, goHome } from "@/app/actions";
import { useRouter } from "next/navigation";

interface DisplayState {
  icon: ReactElement
  title: string | ReactElement
  description: string | ReactElement
  action: ReactNode
}

export default function MemberStatus({ position }: { position: PhasePosition }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleDeque = async () => {
    setIsLoading(true)
    await dequeue()
    router.refresh()
    setIsLoading(false)
  }

  const handleHome = async () => {
    setIsLoading(true)
    await goHome()
    router.refresh()
    setIsLoading(false)
  }


  const actions = {
    cancel: <Button key="cancel" variant="text" color="danger" loading={isLoading} onClick={handleDeque}>Redebeitrag zurückziehen</Button>,
    home: <Button key="home" variant="solid" size="large" block color="primary" loading={isLoading} onClick={handleHome}>Erneut melden</Button>,
    start: <Button key="home" variant="solid" size="large" block color="primary" loading={isLoading} onClick={handleHome}>Zurück zum Start</Button>,
  }

  const states: Record<RegistrationStatus, DisplayState> = {
    ACTIVE: { icon: <MessageOutlined />, title: "Jetzt sprechen", description: "Nun bist du an der Reihe.", action: <></> },
    NEXT: { icon: <AudioOutlined />, title: "Mikrofon aufsuchen", description: "Gleich geht's los. Du bist als nächstes dran.", action: actions.cancel },
    QUEUED: { icon: <HourglassOutlined />, title: "Beitrag angemeldet", description: `Lehn dich zurück. Es befinden sich noch ${position.position} Menschen vor dir in der Warteschlange. Die Seite aktualisiert sich automatisch.`, action: actions.cancel },
    HANDLED: { icon: <CheckCircleOutlined />, title: "Geschafft!", description: "Du kannst dich nun erneut für einen Redebeitrag melden.", action: actions.home },
    SKIPPED: { icon: <FastForwardOutlined />, title: "Du wurdest übersprungen", description: "Bitte melde dich beim Vorsitz, wenn es sich hierbei um einen Fehler handelt.", action: actions.home },
    WITHDRAWN: { icon: <UndoOutlined />, title: "Beitrag zurückgezogen", description: "Du kannst dich jederzeit für einen neuen Redebeitrag melden.", action: actions.home },
    DECLINED: { icon: <StopOutlined />, title: "Beratung geschlossen", description: "Der Tagesordnungspunkt wurde geschlossen. Du kannst dich für den nächsten wieder melden.", action: actions.start },
  }

  const state = states[position.registration.status]

  return (
    <>
      <Card
        bordered={false}
        style={{ width: 400, maxWidth: "80vw" }}
        actions={[state.action]}
      >
        <Row justify="center">
          <Col style={{ fontSize: "5em" }}>{state.icon}</Col>
        </Row>
        <Row justify="center">
          <Col style={{ textAlign: "center" }}>
            <Title level={2}>{state.title}</Title>
          </Col>
        </Row>
        <Row justify="center">
          <Col style={{ textAlign: "center" }}>
            <Text>{state.description}</Text>
          </Col>
        </Row>
      </Card>
      <Row justify="center" style={{ paddingTop: 12 }}>
        <Col style={{ textAlign: "center" }}>
          <Text type="secondary" style={{ fontSize: "0.8em", opacity: 0.5 }}>ID: {position.registration.memberId}</Text>
        </Col>
      </Row>
    </>
  )
}