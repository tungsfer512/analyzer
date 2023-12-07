import React, { useState, useEffect } from 'react';
import { Area, Line } from '@ant-design/charts';

const DemoLine: React.FC = ({ data, otherProps }) => {
  var config = {
    data: data,
    xField: 'time',
    yField: 'value',
    autoFit: false,
    color: ['#1979C9', '#D62A0D', '#FAA219'],
    seriesField: 'category',
    smooth:true,
    ...otherProps,
    height: 200,
    // isPercent: true,
  };
  return <Area {...config} animation={false} />;
};

export default DemoLine;
