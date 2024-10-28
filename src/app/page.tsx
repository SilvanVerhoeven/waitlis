import QueueSelector from '@/components/QueueSelector';
import { Col, Layout, Row } from 'antd';
import { GET as getPhasePosition } from './api/member/[memberId]/route';
import { GET as getCurrentRegistration } from './api/registration/route';
import { GET as getPhases } from './api/phase/route';
import { prisma } from './layout';
import PollPage from '@/components/PollPage';
import MemberStatus from '@/components/MemberStatus';
import { Content } from 'antd/es/layout/layout';

export default async function MemberPage() {
  const queues = await prisma.queue.findMany({ include: { registrations: { include: { phase: true } } } })
  let position = await getPhasePosition()
  const openPhases = await getPhases()
  const currentRegistration = await getCurrentRegistration()

  if (!position && currentRegistration) {
    position = { position: -1, registration: currentRegistration }
  }

  return (
    <Layout style={{ padding: 0, height: "100vh" }}>
      <Content style={{ margin: '24px 16px 0', overflow: 'initial', display: "flex", justifyContent: "center", alignItems: "center" }}>
        <PollPage interval={10000} />
        {position === undefined ?
          <Row justify="center">
            <Col>
              <QueueSelector queues={queues} open={openPhases.length > 0} />
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
