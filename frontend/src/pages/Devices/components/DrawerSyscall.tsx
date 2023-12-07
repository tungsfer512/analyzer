import { useModel } from 'umi';
import { Button, Drawer, Spin } from 'antd';
import React, { useState, useEffect, useRef, ReactNode } from 'react';
import moment from 'moment';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

interface IDrawer {
  id: string;
  pid: string;
  name: string;
  children?: ReactNode;
}
const DrawerSyscall: React.FC = (props: IDrawer) => {
  const {
    arrModalSyscall,
    setArrModalSyscall,
    visibleModalSyscall,
    setVisibleModalSyscall,
  } = useModel('device_detail');

  const { stopTrace } = useModel('device_detail');
  const { getDataById } = useModel('devices');
  const lastRefDiv = useRef(null);

  const scrollToBottom = () => {
    if (lastRefDiv?.current) lastRefDiv?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const stopTraceSyscall = (device_id: string, pid: string) => {
    stopTrace(device_id, pid);
    getDataById(device_id);
    setArrModalSyscall([]);
    setVisibleModalSyscall(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [arrModalSyscall]);
  return (
    <Drawer
      visible={visibleModalSyscall}
      title={
        <b>{`Theo dõi tiến trình ${props.pid || ''} trên thiết bị ${props.deviceName || ''}`}</b>
      }
      width="80%"
      destroyOnClose
      onClose={() => {
        setVisibleModalSyscall(false);
      }}
      footer={
        <div>
          <Button
            type="primary"
            onClick={() => {
              // Dừng theo dõi
              stopTraceSyscall(props.id, props.pid);
            }}
            style={{ marginRight: 8 }}
          >
            Dừng theo dõi
          </Button>
          ,
          <Button
            onClick={() => {
              // Dừng theo dõi
              setVisibleModalSyscall(false);
            }}
          >
            Đóng
          </Button>
        </div>
      }
    >
      <div>
        {arrModalSyscall?.map((item, index) => (
          <p>
            {`Thời gian: ${moment(new Date(item.created)).format('DD/MM/YYYY hh:mm:ss')} `}
            SystemCall:<b>{` ${item.syscall} `}</b>
            {`PID: ${item.device_id}`}
          </p>
        ))}
        <Spin indicator={antIcon} />
        <div style={{ float: 'left', clear: 'both' }} ref={lastRefDiv}></div>
      </div>
    </Drawer>
  );
};

export default DrawerSyscall;
