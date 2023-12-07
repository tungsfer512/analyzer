import { socketIP } from '@/services/ip';
import { useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
// import { notification } from 'antd';

export default () => {
  const [socket, setSocket] = useState<ReconnectingWebSocket | null>(
    new ReconnectingWebSocket(`ws://${socketIP}/ws/chat/alerts/`, null, { debug: true }),
  );

  return {
    socket,
  };
};
