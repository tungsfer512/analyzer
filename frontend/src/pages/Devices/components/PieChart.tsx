import React, { useState, useEffect } from 'react';
import { Pie } from '@ant-design/charts';

const DemoPie: React.FC = ({ data }) => {
  // var data = [
  //   {
  //     type: '192.168.10.2',
  //     value: 27,
  //   },
  //   {
  //     type: '192.168.10.10',
  //     value: 25,
  //   },
  //   {
  //     type: '172.160.10.2',
  //     value: 18,
  //   },
  //   {
  //     type: '10.0.0.1',
  //     value: 15,
  //   },
  //   {
  //     type: '10.0.0.2',
  //     value: 10,
  //   },
  //   {
  //     type: '10.0.0.10',
  //     value: 5,
  //   },
  // ];
  var config = {
    appendPadding: 10,
    data: data,
    angleField: 'value',
    colorField: 'ip',
    radius: 0.9,
    label: {
      type: 'outer',
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [{ type: 'element-active' }],
  };
  return <Pie {...config} />;
};

export default DemoPie;