import React, { useState, useEffect } from 'react';
import { Scatter, G2 } from '@ant-design/charts';

const DemoScatter: React.FC = () => {
  G2.registerShape('point', 'custom-shape', {
    draw(cfg, group) {
      const cx = cfg.x;
      const cy = cfg.y;
      const radius = cfg.size || 5;
      const polygon = group.addShape('path', {
        attrs: {
          path: [
            ['M', cx - radius, cy - radius],
            ['L', cx + radius, cy - radius],
            ['L', cx, cy + radius],
            ['Z'],
          ],
          ...cfg.defaultStyle,
          ...cfg.style,
        },
      });
      return polygon;
    },
  });
  const [data, setData] = useState([]);
  useEffect(() => {
    asyncFetch();
  }, []);
  const asyncFetch = () => {
    fetch('https://gw.alipayobjects.com/os/bmw-prod/3e4db10a-9da1-4b44-80d8-c128f42764a8.json')
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };
  var config = {
    appendPadding: 30,
    data: data,
    xField: 'xG conceded',
    yField: 'Shot conceded',
    shape: 'custom-shape',
    pointStyle: { lineWidth: 2 },
    size: 6,
    yAxis: {
      nice: true,
      line: { style: { stroke: '#aaa' } },
    },
    tooltip: { showMarkers: false },
    xAxis: {
      grid: { line: { style: { stroke: '#eee' } } },
      line: { style: { stroke: '#aaa' } },
    },
    label: {},
  };
  return <Scatter {...config} />;
};

export default DemoScatter;