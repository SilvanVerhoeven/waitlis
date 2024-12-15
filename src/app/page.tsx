import QueueSelector from '@/components/QueueSelector';
import { Col, Layout, Row } from 'antd';
import PollPage from '@/components/PollPage';
import MemberStatus from '@/components/MemberStatus';
import { Content } from 'antd/es/layout/layout';
import { Phase, Registration } from '@prisma/client';
import { cookies } from 'next/headers';
import { PhasePosition } from './api/member/[memberId]/route';
import { ErrorResponse, isErrorResponse } from './lib/types';
import Link from 'next/link';

export default async function MemberPage() {
  const cookieStore = await cookies()
  const memberId = cookieStore.get("memberId")?.value
  const registrationId = cookieStore.get("registrationId")

  const queues = await (await fetch(`${process.env.SERVER_URL}/api/queue/all`, { next: { tags: ['order', 'queues', 'phases'] } })).json()
  let position: PhasePosition | ErrorResponse = await (await fetch(`${process.env.SERVER_URL}/api/member/${memberId}`, { next: { tags: ['order', 'phases'] } })).json()
  const openPhases: Phase[] | ErrorResponse = await (await fetch(`${process.env.SERVER_URL}/api/phase`, { next: { tags: ['phases'] } })).json()
  const currentRegistration: Registration | ErrorResponse = await (await fetch(`${process.env.SERVER_URL}/api/registration/${registrationId?.value ?? -1}`, { next: { tags: ['registration', 'order'] } })).json()

  if (isErrorResponse(position) && !isErrorResponse(currentRegistration)) {
    position = { position: -1, registration: currentRegistration }
  }

  return (
    <Layout style={{ padding: 0, height: "100vh", overflow: "hidden" }}>
      <Content style={{ padding: 0, margin: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
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
      <Content style={{ flex: "0 0 3rem" }} >
        <Row justify="center" align="middle" gutter={10}>
          <Col>
            <Link href="/impressum">Impressum</Link>
          </Col>
          <Col>
            &bull;
          </Col>
          <Col>
            <Link href="/datenschutz">Datenschutz</Link>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
