import React, { useState, useEffect } from 'react';
import { WordCloud } from '@ant-design/charts';

const dataSample = {
  'google.com': 89,
  'facebook.com': 58,
  'instagram.com': 309,
  'twitter.com': 1065,
  'dantri.com': 597,
  'chongluadao.vn': 1351,
  'apple.com': 28,
  'chplay.vn': 1348,
  'kenh14.vn': 701,
  'antv.gov.vn': 87,
  'ncov.moh.gov.vn': 3429,
  'fshare.com': 1,
  'fb.com': 4,
  'thegioididong.com': 1,
  'youtube.com': 6,
  'baidu.com': 717,
  'soundclound.com': 91,
  'me.zing.vn': 1,
  'lotus.vn': 2,
  'gapo.vn': 6,
  'tiki.com': 2,
  'sendo.com': 2,
  'chotot.com': 8,
  'flickr.com': 2,
  'pinterest.com': 2,
  'zalo.me': 2,
  'messenger.com': 10,
  'alibaba.com': 100,
  'airpay.vn': 40,
  'qldt.ptit.edu.vn': 100,
  'wikipedia.org': 30,
  'spoj.com': 2,
  'news.samsung.com': 400,
  'booking.com': 30,
  'hust.edu.vn': 150,
};

const renderData = (data) =>
  Object.keys(data).map((key) => ({
    x: key,
    value: data[key],
  }));

const DemoWordCloud: React.FC = (props) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    asyncFetch();
  }, []);
  const asyncFetch = () => {
    setData(renderData(props.dataSource || dataSample));
  };
  var config = {
    data: data,
    wordField: 'x',
    weightField: 'value',
    color: '#122c6a',
    wordStyle: {
      fontFamily: 'Verdana',
      fontSize: [24, 80],
    },
    interactions: [{ type: 'element-active' }],
    state: { active: { style: { lineWidth: 3 } } },
    random: function random() {
      return 0.5;
    },
  };
  return <WordCloud {...config} />;
};

export default DemoWordCloud;
