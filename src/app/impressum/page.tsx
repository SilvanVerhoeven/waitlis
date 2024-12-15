import { Col, Layout, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';

export default async function ImpressPage() {
  const content = await (await fetch(`${process.env.SERVER_URL}/content/impressum.html`, { cache: "no-store" })).text();

  return (
    <Layout style={{ padding: 0, height: "100vh" }}>
      <Content style={{ padding: 0, margin: 0, display: "flex", justifyContent: "center", alignItems: "center", overflow: "auto" }}>
        <Row justify="center">
          <Col dangerouslySetInnerHTML={{ __html: content }}></Col>
        </Row>
      </Content >
    </Layout >
  );
}
