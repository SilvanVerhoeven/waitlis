import { Col, Layout, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';

export default async function ImpressPage() {
  const content = await (await fetch(`${process.env.SERVER_URL}/content/datenschutz.html`, { cache: "no-store" })).text();

  return (
    <Layout style={{ padding: 0, height: "100vh" }}>
      <Content style={{ padding: 0, margin: 0, display: "flex", justifyContent: "center", overflow: "auto" }}>
        <Row justify="center">
          <Col span={6} dangerouslySetInnerHTML={{ __html: content }}></Col>
        </Row>
      </Content >
    </Layout >
  );
}
