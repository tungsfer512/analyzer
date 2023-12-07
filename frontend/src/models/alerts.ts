import { useEffect, useState, useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
// import { notification } from 'antd';
import moment from 'moment';
import { getAlerts, deleteAlerts, getAlertsDashboard, exportDataExcel, exportDataPDF } from '@/services/alerts';
import { ip } from '@/services/ip';

export default () => {
  const actionRef = useRef<ActionType>();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [payloadModel, setPayloadModel] = useState(undefined);
  const [excelFile, setExcelFile] = useState(undefined);
  const initFilter = {
    status: '*',
    type: '*',
    timestamp: undefined,
    device: '*',
    message: undefined,
    ip: undefined,
    address: undefined,
    // [moment('1/1/1900').toISOString(),moment('1/1/3000').toISOString()],

  }
  const [filter, setFilter] = useState(initFilter);

  const getData = async (payload) => {
    setLoading(true);
    getAlerts({ ...payload })
      .then((res) => {
        setData(res?.results ?? []);
        setTotal(res?.count);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getDataDashboard = async (payload) => {
    setLoading(true);
    getAlertsDashboard({ ...payload })
      .then((res) => {
        console.log(res);
        setData(res?.results ?? []);
        setTotal(res?.count);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteData = async (id: number) => {
    setLoading(true);
    await deleteAlerts(id)
      .then((res) => {
        setData(res?.results ?? []);
        setTotal(res?.count);
      })
      .finally(() => {
        setLoading(false);
      });
    await actionRef?.current?.reloadAndRest?.();
  }

  const getExportDataExcel = async (payload) => {
    setLoading(true);
    exportDataExcel({ ...payload })
      .then((res) => {
        // console.log(res);
        setExcelFile(res);
        window.open(`${ip}${res}`, '_blank');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getExportDataPDF = async (payload) => {
    setLoading(true);
    exportDataPDF({ ...payload })
      .then((res) => {
        // console.log(res);
        setExcelFile(res);
        window.open(`${ip}${res}`, '_blank');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { filter, setFilter, initFilter, actionRef, loading, data, getData, deleteData, total, setTotal, payloadModel, setPayloadModel, getDataDashboard, getExportDataExcel, getExportDataPDF, excelFile, setExcelFile };
};
