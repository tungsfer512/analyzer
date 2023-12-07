
import { ip } from '@/services/ip';
import { Badge, Card, Col, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { DashboardBlank } from '@/services/ip';

const Dashboard = () => {
  

  return (
    <div>
      <span Style="width: 286px;height: 40px;position: absolute;background-color: #181B1F;"></span>
      <span Style="width: 77px;height: 40px;position: absolute;background-color: #181B1F;right:0"></span>
      <iframe src={`${DashboardBlank}d/000000029/demo-kc?orgId=1&refresh=5s&kiosk=tv`} width="100%" height="800" frameborder="0" ></iframe>
    </div>

    )
};

export default Dashboard;
