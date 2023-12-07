import React, { useState, useEffect } from 'react';
import { Pie } from '@ant-design/charts';

const DemoPie: React.FC = (props) => {
 
  var config = {
    appendPadding: 10,
    data: props?.data??[],
    angleField: 'value',
    colorField: 'type',
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