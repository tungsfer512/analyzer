import React from 'react';
import { Card, Typography } from 'antd';

const ChartCard = ({ title, total, description }) => {
  return (
    <Card style={{ minHeight: 190 }}>
      <Typography.Title level={3}>{title}</Typography.Title>
      {total ? (
        <Typography.Title level={3} style={{ marginTop: 20 }}>
          <b>{total}</b>
        </Typography.Title>
      ) : (
        <Typography.Title level={3} style={{ marginTop: 20 }}>
          {' '}
        </Typography.Title>
      )}
      {description}
    </Card>
  );
};

export default ChartCard;
