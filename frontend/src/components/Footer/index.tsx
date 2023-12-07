import React, { useEffect, useState } from 'react';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { Button, notification } from 'antd';
import { rawIP } from '../../services/ip';
import { history, useModel } from 'umi';
import { deviceNormal } from '@/services/alerts';

export default () => {
  notification.config({
    maxCount: 3
  })
  const { stopTrace, startTraceNetwork } = useModel('device_detail');
  const { socket, initSocket } = useModel('socket');
  const device_detail = useModel("device_detail")

  const traceNetwork = (idDevice) => {
    startTraceNetwork(idDevice);
  };

  useEffect(() => {
    socket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      console.log(data);

      if (data.type === 'cmd') {
        if (data.message === 'stop_tracing_syscall') {
          stopTrace();
        }
      }
      if (data.type === 'alerts') {
        if (typeof data?.message === 'string') {
          notification.warning({
            placement: 'topRight',
            message: 'Bạn có thông báo mới',
            description: `${data?.message} tại vị trí ${data?.address}` ?? '',
            // btn: (
            //   <div
            //     style={{
            //       display: 'flex',
            //       justifyContent: 'space-between',
            //       width: '100%',
            //       gap: '16px',
            //     }}
            //   >
            //     {data?.id && (
            //       <Button
            //         type="primary"
            //         onClick={async () => {
            //           await deviceNormal(data?.id);
            //         }}
            //       >
            //         Đánh dấu là bình thường
            //       </Button>
            //     )}
            //     <Button
            //       type="primary"
            //       onClick={() => {
            //         history.push('/alert');
            //       }}
            //     >
            //       Xem thêm
            //     </Button>
            //   </div>
            // ),
          });
        }
      }
      if (data.type === 'alert_check_norm') {
        if (typeof data?.message === 'string') {
          notification.warning({
            placement: 'topRight',
            message: 'Bạn có thông báo mới',
            description: `${data?.message} tại vị trí ${data?.address}` ?? '',
            btn: (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  gap: '16px',
                }}
              >
                {data?.id && (
                  <Button
                    type="primary"
                    onClick={async () => {
                      await deviceNormal(data?.id);
                    }}
                  >
                    Đánh dấu là bình thường
                  </Button>
                )}
                <Button
                  type="primary"
                  onClick={() => {
                    traceNetwork(data?.id);
                  }}
                >
                  Theo dõi
                </Button>
              </div>
            ),
          });
        }
      }

      if (data.type === 'alert_process') {
        if (typeof data?.message === 'string') {
          notification.warning({
            placement: 'topRight',
            message: 'Bạn có thông báo mới',
            description: `${data?.message} tại vị trí ${data?.address}` ?? '',
            btn: (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  gap: '16px',
                }}
              >
                {data?.id && (
                  <Button
                    type="primary"
                    onClick={async () => {
                      await device_detail.killProcess(data?.alert_id, data?.id, data?.pid);
                    }}
                  >
                    Dừng tiến trình
                  </Button>
                )}
              </div>
            ),
          });
        }
      }

      if (data.type === 'integrity')
        if (typeof data?.message === 'string') {
          notification.warning({
            placement: 'topRight',
            message: 'Bạn có thông báo mới',
            description: `${data?.message} tại vị trí ${data?.address}` ?? '',
          });
        }
    };
    return () => {
      socket?.close();
    };
  }, []);

  return (
    <DefaultFooter
      copyright="2023 PTIT"
      links={
        [
          // {
          //   key: 'Analyzer',
          //   title: 'Analyzer',
          //   href: 'https://pro.ant.design',
          //   blankTarget: true,
          // },
          // {
          //   key: 'github',
          //   title: <GithubOutlined />,
          //   href: 'https://github.com/ant-design/ant-design-pro',
          //   blankTarget: true,
          // },
          // {
          //   key: 'Ant Design',
          //   title: 'Ant Design',
          //   href: 'https://ant.design',
          //   blankTarget: true,
          // },
        ]
      }
    />
  );
};
