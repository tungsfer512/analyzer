import React, { useState, useEffect } from 'react';
import { Liquid } from '@ant-design/charts';

const DemoLiquid: React.FC = (props) => {
  var config = {
    percent: props?.value??0,
    statistic: {
      title: {
        formatter: function formatter() {
          return props?.title??'';
        },
        style: function style(_ref) {
          var percent = _ref.percent;
          return { fill: percent > 0.65 ? 'white' : 'rgba(44,53,66,0.85)' };
        },
      },
    },
    outline: {
      border: 4,
      distance: 8,
    },
    wave: { length: 128 },
  };
  return <Liquid {...config} />;
};

export default DemoLiquid;
