import React from 'react';
import { LineLayer, AMapScene, PointLayer, MapboxScene } from '@antv/l7-react';

export default React.memo(function Map() {
  const [dotData, setDotData] = React.useState();
  const [flyData, setFlyData] = React.useState();
  React.useEffect(() => {
    const dotSample = [
      {
        area: "Hà Nội",
        entryAmount: "0.02",
        outboundAmount: "485.21",
        dotid: 0,
        value: 0.02,
        info: "Thủ đô",
        name: "Hà Nội",
        lng: 105.8342,
        lat: 21.0278,
        type: "ok"
      },
      {
        area: "Đà Nẵng",
        entryAmount: "0.02",
        outboundAmount: "485.21",
        dotid: 1,
        value: 0.02,
        info: "TP Đà Nẵng",
        name: "Đà Nẵng",
        lng: 108.206230,
        lat: 16.047079,
        type: "ok"
      },
      {
        area: "Hoàng Sa",
        entryAmount: "0.02",
        outboundAmount: "485.21",
        dotid: 1,
        value: 0.02,
        info: "QĐ Hoàng Sa",
        name: "QĐ Hoàng Sa",
        lng: 112.318037,
        lat: 16.530898,
        type: "ok"
      },
      {
        area: "Trường Sa",
        entryAmount: "0.02",
        outboundAmount: "485.21",
        dotid: 1,
        value: 0.02,
        info: "QĐ Trường Sa",
        name: "QĐ Trường Sa",
        lng: 111.966240,
        lat: 8.646196,
        type: "ok"
      },
      {
        area: "HCM",
        entryAmount: "0.00",
        outboundAmount: "0.21",
        dotid: 2,
        value: 0,
        info: "HCM",
        name: "HCM",
        lng: 106.6297,
        lat: 10.8231,
        type: "ok"
      }
    ]

    const flyLineSample = [
      {
        from: "105.8342, 21.0278",
        to: "108.206230, 16.047079",
      },
      {
        from: "105.8342, 21.0278",
        to: "111.966240, 8.646196"
      },
      {
        from: "105.8342, 21.0278",
        to: "112.318037, 16.530898"
      },
      {
        from: "108.206230, 16.047079",
        to: "112.318037, 16.530898"
      },
      {
        from: "106.6297, 10.8231",
        to: "111.966240, 8.646196",
      },
      {
        from: "106.6297, 10.8231",
        to: "112.318037, 16.530898",
      },
      {
        from: "112.318037, 16.530898",
        to: "111.966240, 8.646196",
      },
      {
        from: "105.8342, 21.0278",
        to: "106.6297, 10.8231"
      }
    ]
    const dotData = eval(dotSample);
    const flyData = eval(flyLineSample).map(item => {
      const latlng1 = item.from.split(',').map(e => { return e * 1; });
      const latlng2 = item.to.split(',').map(e => { return e * 1; });
      return { coord: [latlng1, latlng2] };
    });

    setDotData(dotData);
    setFlyData(flyData);
  }, []);
  return (
    <>
      <MapboxScene
        map={{
          center: [108.2022, 16.0544],
          pitch: 0,
          style: 'dark',
          zoom: 5,
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {dotData && <PointLayer
          source={{
            data: dotData,
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat'
            },
            transforms: [],
          }}
          shape={{
            values: 'circle',
          }}
          color={{
            values: '#abc7e9',
          }}
          animate={{
            speed: 0.8
          }}
          size={{
            values: 30,
          }}
          style={{
            opacity: 1.0,
          }}
        />}
        {flyData && <LineLayer
          source={{
            data: flyData,
            parser: {
              type: 'json',
              coordinates: 'coord'
            }
          }}
          color={{
            values: '#b97feb',
          }}
          size={{
            values: 2,
          }}
          active={{
            option: true
          }}
          shape={{
            values: 'arc3d',
          }}
          style={{
            opacity: 1,
          }}
          animate={{
            interval: 2,
            trailLength: 2,
            duration: 1,
          }}
        />}
      </MapboxScene>
    </>
  );
});
