import { useModel } from 'umi';
import { IDashboard } from '@/models/dashboard';
import { Card, Col, Row, Spin, Button, Divider } from 'antd';
import React, { useEffect } from 'react';
import DemoLiquid from './components/DemoLiquid';
import { DashboardBlank } from '@/services/ip';

const Dashboard = () => {
  const dashboard = useModel('dashboard');
  const dataDashboard: IDashboard = dashboard?.dataDashboard ?? null;
  useEffect(() => {
    dashboard.getDataDashboard({});
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     dashboard.getDataDashboard({});
  //   }
  //     , 5000);
  //   return () => {
  //     clearInterval(interval);
  //   }
  // }, []);

  const handleStartTracePcap = () => {
    dashboard.startTracePcapData({});
  }

  const handleStopTracePcap = () => {
    dashboard.stopTracePcapData({});
  }

  return (
    <Spin spinning={dashboard?.loading || false}>
      <Row>
        {
          dataDashboard?.TRACE_PCAP ?
            <Button
              type="primary"
              htmlType="button"
              onClick={handleStopTracePcap}
            >
              Dừng theo dõi luồng mạng
            </Button>
            :
            <Button
              type="primary"
              htmlType="button"
              onClick={handleStartTracePcap}
            >
              Bắt đầu theo dõi luồng mạng
            </Button>
        }
      </Row>
      <Divider />
      <Row>
        <Col xs={24}>
          <Card title="Tài nguyên RAM-CPU máy chủ">
            <iframe src={`http://${DashboardBlank}/d-solo/bbc3048e-93bf-4708-85c0-6a5ca86ebf7e/cpu-ram?orgId=1&refresh=10s&from=1701970581878&to=1701971181878&panelId=1`} width="100%" height="300px" frameborder="0"></iframe>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={24} md={12}>
          <Card>
            {/* <DemoLiquid value={dataDashboard?.CPU} title="CPU" /> */}
            <iframe src={`http://${DashboardBlank}/d-solo/e5ee296d-d626-4efd-a969-1d02532b252d/datn?orgId=1&from=1701962758234&to=1701966358234&theme=dark&panelId=2`} width="100%" height="300px" frameborder="0"></iframe>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card>
            {/* <DemoLiquid value={dataDashboard?.RAM} title="RAM" /> */}
            <iframe src={`http://${DashboardBlank}/d-solo/e5ee296d-d626-4efd-a969-1d02532b252d/datn?orgId=1&from=1701962723935&to=1701966323935&theme=dark&panelId=3`} width="100%" height="300px" frameborder="0"></iframe>
          </Card>
        </Col>
      </Row>
    </Spin>
  );
};

export default Dashboard;
