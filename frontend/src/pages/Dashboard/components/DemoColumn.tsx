import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/charts';

const DemoColumn: React.FC = () => {
  var data = [
    {
      type: '192.168.1.2',
      sales: 38,
    },
    {
      type: '10.0.0.1',
      sales: 52,
    },
    {
      type: '162.10.2.2',
      sales: 61,
    },
    {
      type: '130.3.3.10',
      sales: 145,
    },
    {
      type: '10.0.0.3',
      sales: 48,
    },
    {
      type: '10.10.0.1',
      sales: 38,
    },
    {
      type: '192.168.100.2',
      sales: 38,
    },
  ];
  var config = {
    data: data,
    xField: 'type',
    yField: 'sales',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    yAxis: {
      label: {
        formatter: function formatter(v) {
          return `${v}`;
        },
      },
    },
    meta: {
      type: { alias: 'Địa chỉ ip' },
      sales: { alias: 'Số lần truy cập' },
    },
  };
  return <Column {...config} />;
};

export default DemoColumn;
