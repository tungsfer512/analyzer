import React from 'react';
import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { Card, Typography, Alert } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';

export default (): React.ReactNode => (
  <PageContainer content=" admin">
    <Card>
      <Alert
        message="umi ui"
        type="success"
        showIcon
        banner
        style={{
          margin: -12,
          marginBottom: 48,
        }}
      />
      <Typography.Title level={2} style={{ textAlign: 'center' }}>
        <SmileTwoTone /> Hệ thống quản lý các thiết bị  <HeartTwoTone twoToneColor="#eb2f96" /> IoT
      </Typography.Title>
    </Card>
  </PageContainer>
);
