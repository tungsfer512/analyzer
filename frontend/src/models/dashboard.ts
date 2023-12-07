import { useState } from 'react';
import { getDashboard, startTracePcap, stopTracePcap } from '@/services/dashboard';

export interface IDashboard {
  device_counts: number,
  monitored_devices_counts: number,
  free_devices_counts: number,
  alert_counts: number,
  reviewed_alert_counts: number,
  pending_alert_counts: number,
  malware_alert_counts: number,
  syscall_alert_counts: number,
  network_alert_counts: number,
  RAM: number,
  CPU: number,
  TRACE_PCAP: boolean,
}

export default () => {
  const [dataDashboard, setDataDashboard] = useState();
  const [loading, setLoading] = useState<IDashboard | boolean>(false);

  const getDataDashboard = async (payload: any) => {
    setLoading(true);
    const data = await getDashboard(payload ?? {});
    setDataDashboard(data);
    setLoading(false);
  }
  
  const startTracePcapData = async (payload: any) => {
    setLoading(true);
    const data = await startTracePcap(payload ?? {});
    setDataDashboard(data);
    setLoading(false);
  }
  
  const stopTracePcapData = async (payload: any) => {
    setLoading(true);
    const data = await stopTracePcap(payload ?? {});
    setDataDashboard(data);
    setLoading(false);
  }

  return {
    loading,
    dataDashboard,
    getDataDashboard,
    startTracePcapData,
    stopTracePcapData,
  }
};
