import QueueSelector from '@/components/QueueSelector';
import { Col, Layout, Row } from 'antd';
import PollPage from '@/components/PollPage';
import MemberStatus from '@/components/MemberStatus';
import { Content } from 'antd/es/layout/layout';
import { Phase, Registration } from '@prisma/client';
import { cookies } from 'next/headers';
import { PhasePosition } from './api/member/[memberId]/route';
import { prisma } from './lib/db';
import { ErrorResponse, isErrorResponse } from './lib/types';

export default async function MemberPage() {
  const cookieStore = await cookies()
  const memberId = cookieStore.get("memberId")?.value
  const registrationId = cookieStore.get("registrationId")

  const queues = await prisma.queue.findMany({ include: { registrations: { include: { phase: true } } } })
  let position: PhasePosition | ErrorResponse = await (await fetch(`${process.env.SERVER_URL}/api/member/${memberId}`, { next: { tags: ['order', 'phases'] } })).json()
  const openPhases: Phase[] | ErrorResponse = await (await fetch(`${process.env.SERVER_URL}/api/phase`, { next: { tags: ['phases'] } })).json()
  const currentRegistration: Registration | ErrorResponse = await (await fetch(`${process.env.SERVER_URL}/api/registration/${registrationId?.value ?? -1}`, { next: { tags: ['registration', 'order'] } })).json()

  if (isErrorResponse(position) && !isErrorResponse(currentRegistration)) {
    position = { position: -1, registration: currentRegistration }
  }

  return (
    <Layout style={{ padding: 0, height: "100vh" }}>
      <Content style={{ margin: '24px 16px 0', display: "flex", justifyContent: "center", alignItems: "center" }}>
        <PollPage interval={Number(process.env.POLLING_INTERVAL_APP)} />
        {isErrorResponse(position) ?
          <Row justify="center">
            <Col>
              <QueueSelector queues={queues} open={!isErrorResponse(openPhases) && openPhases.length > 0} />
            </Col>
          </Row>
          :
          <Row justify="center">
            <Col>
              <MemberStatus position={position} />
            </Col>
          </Row>
        }
      </Content>
    </Layout>
  );
}
