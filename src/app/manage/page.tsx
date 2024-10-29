import { Button, Col, Divider, Layout, Row } from 'antd';
import QueueDisplay from '@/components/Queue';
import NewQueueButton from '@/components/NewQueueButton';
import { Content, Footer } from 'antd/es/layout/layout';
import React from 'react';
import Title from 'antd/es/typography/Title';
import PhaseStatusToggle from '@/components/PhaseStatusToggle';
import { FastBackwardOutlined } from '@ant-design/icons';
import Text from 'antd/es/typography/Text';
import PhaseStatusIndicator from '@/components/PhaseStatusIndicator';
import { Phase, PhaseStatus, Registration } from '@prisma/client';
import NextPhaseButton from '@/components/NextPhaseButton';
import { QueueWithRegistrations } from '../api/queue/route';
import CallNextButton from '@/components/CallNextButton';
import PollPage from '@/components/PollPage';
import { ErrorResponse, isErrorResponse } from '../lib/types';

export const dynamic = "force-dynamic"

export default async function ManageView() {
  const registrations: Registration[] = await (await fetch(`${process.env.SERVER_URL}/api/phase/call`, { next: { tags: ['phases', 'order'] } })).json()
  const phase: Phase | ErrorResponse = await (await fetch(`${process.env.SERVER_URL}/api/phase/latest`, { next: { tags: ['phases'] } })).json()
  const queues: QueueWithRegistrations[] = await (await fetch(`${process.env.SERVER_URL}/api/queue/all`, { next: { tags: ['queues', 'phases', 'order'] } })).json()

  return (
    <Layout style={{ padding: 0, height: "100vh" }}>
      <PollPage interval={Number(process.env.POLLING_INTERVAL_MANAGE)} />
      <Layout>
        <Content style={{ margin: '24px 16px 0' }}>
          <Row justify="center">
            <Col>
              <Row justify="center" gutter={5}>
                {queues.map(queue => <Col key={queue.id}><QueueDisplay queue={queue} defaultMode={!queue.name ? "edit" : "view"} /></Col>)}
              </Row>
            </Col>
          </Row>
        </Content>
      </Layout>
      <Footer className='control-panel' style={{ background: 'white', boxShadow: "10px 0px 10px lightgray" }}>
        <Row gutter={10} justify="center">
          <Col>
            <Divider orientation="left" orientationMargin={0}>
              <Title level={5} style={{ marginTop: 0, display: 'inline' }}>Tagesordnung</Title>
            </Divider>
            <Row gutter={10}>
              <Col>
                <Button
                  color="default"
                  size="large"
                  style={{ flexDirection: "column", height: "unset" }}
                  disabled={true}>
                  <FastBackwardOutlined style={{ fontSize: "1.4em" }} />
                  <Text style={{ color: "inherit" }}>Zurück</Text>
                </Button>
              </Col>
              <Col>
                <NextPhaseButton />
              </Col>
            </Row>
          </Col>
          <Col><Divider type="vertical" /></Col>
          <Col>
            <Divider orientation="left" orientationMargin={0}>
              <PhaseStatusIndicator />
              <Title level={5} style={{ marginTop: 0, display: 'inline' }}>Redeliste</Title>
            </Divider>
            <Row gutter={10}>
              <Col><NewQueueButton /></Col>
              <Col><PhaseStatusToggle disabled={isErrorResponse(phase)} status={isErrorResponse(phase) ? PhaseStatus.CLOSED : phase.status} /></Col>
              <Col>
                <CallNextButton disabled={registrations.length === 0} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
}