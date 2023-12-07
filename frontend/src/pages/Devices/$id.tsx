import { socketIP } from '@/services/ip';
import { TYPE_ALERT } from '@/utils/constants';
import {
  ArrowLeftOutlined,
  CloseCircleOutlined,
  EditOutlined,
  FileSearchOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Input,
  Row,
  Select,
  Table,
  Tabs,
  Form,
  Modal,
} from 'antd';
import moment from 'moment';
import Animate from 'rc-animate';
import React, { useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { useModel } from 'umi';
import ChartLine from './components/ChartLine';
import DrawerSyscall from './components/DrawerSyscall';
import DemoPie from './components/PieChart';
import BlackListIp from '@/pages/QuanLyDanhSachIp/BlackListIp';
import WhiteListIp from '@/pages/QuanLyDanhSachIp/WhiteListIp';
import { DashboardBlank } from '@/services/ip';

moment.locale('vi');

const Div = (props) => {
  const childrenProps = { ...props };
  delete childrenProps.show;
  return <div {...childrenProps} />;
};

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const compareTwoPoint = (x, y) => {
  // if (y?.time < x?.time) y.time = x?.time
  return x && y && x?.time === y?.time && x?.value === y?.value;
};
const Device = ({
  match: {
    params: { id: idDevice },
  },
}: {
  match: {
    params: {
      id: string;
    };
  };
}) => {
  const [valueTabPane, setvalueTabPane] = useState('chart');
  // const { socket, initSocket } = useModel('socket');
  const device = useModel('device_detail');
  const [show, setShow] = useState(true);
  const [processlistFromWS, setProcesslistFromWS] = useState([]);
  const { setArrModalSyscall, setVisibleModalSyscall } = device;
  const integrity = useModel('integrity');
  const devices = useModel('devices');
  const name = devices?.record?.name ?? '';
  const recordDevice = devices?.record ?? {};
  const [dataSocket, setDataSocket] = useState(null);
  const [ipSearch, setIpSearch] = useState('');
  const [processSearch, setProcessSearch] = useState('');
  const [virussTotalFilter, setVirussTotalFilter] = useState(false);
  const [dataChartCPU, setDataChartCPU] = useState([
    { category: 'CPU', time: '0', value: 0 },
    { category: 'CPU', time: '1', value: 0 },
    { category: 'CPU', time: '2', value: 0 },
    { category: 'CPU', time: '3', value: 0 },
    { category: 'CPU', time: '4', value: 0 },
    { category: 'CPU', time: '5', value: 0 },
    { category: 'CPU', time: '6', value: 0 },
    { category: 'CPU', time: '7', value: 0 },
    { category: 'CPU', time: '8', value: 0 },
    { category: 'CPU', time: '9', value: 0 },
  ]);
  const [dataChartRAM, setDataChartRAM] = useState([
    { category: 'RAM', time: '0', value: 0 },
    { category: 'RAM', time: '1', value: 0 },
    { category: 'RAM', time: '2', value: 0 },
    { category: 'RAM', time: '3', value: 0 },
    { category: 'RAM', time: '4', value: 0 },
    { category: 'RAM', time: '5', value: 0 },
    { category: 'RAM', time: '6', value: 0 },
    { category: 'RAM', time: '7', value: 0 },
    { category: 'RAM', time: '8', value: 0 },
    { category: 'RAM', time: '9', value: 0 },
  ]);
  const [dataChartSPEEDUP, setDataChartSPEEDUP] = useState([
    { category: 'SPEED_UP', time: '0', value: 0 },
    { category: 'SPEED_UP', time: '1', value: 0 },
    { category: 'SPEED_UP', time: '2', value: 0 },
    { category: 'SPEED_UP', time: '3', value: 0 },
    { category: 'SPEED_UP', time: '4', value: 0 },
    { category: 'SPEED_UP', time: '5', value: 0 },
    { category: 'SPEED_UP', time: '6', value: 0 },
    { category: 'SPEED_UP', time: '7', value: 0 },
    { category: 'SPEED_UP', time: '8', value: 0 },
    { category: 'SPEED_UP', time: '9', value: 0 },
  ]);
  const [dataChartSPEEDDOWN, setDataChartSPEEDDOWN] = useState([
    { category: 'SPEED_DOWN', time: '0', value: 0 },
    { category: 'SPEED_DOWN', time: '1', value: 0 },
    { category: 'SPEED_DOWN', time: '2', value: 0 },
    { category: 'SPEED_DOWN', time: '3', value: 0 },
    { category: 'SPEED_DOWN', time: '4', value: 0 },
    { category: 'SPEED_DOWN', time: '5', value: 0 },
    { category: 'SPEED_DOWN', time: '6', value: 0 },
    { category: 'SPEED_DOWN', time: '7', value: 0 },
    { category: 'SPEED_DOWN', time: '8', value: 0 },
    { category: 'SPEED_DOWN', time: '9', value: 0 },
  ]);

  const [typeAlert, setTypeAlert] = useState(0);
  const [isModalChinhSuaGioiHanVisible, setModalChinhSuaGioiHanVisible] = useState(false);

  const [chinhSuaGioiHanForm] = Form.useForm();

  const showModalChinhSuaGioiHan = async (id_device: any) => {
    // setClickedCard(el);
    const data_ = await devices.getGioiHanData(id_device)
    console.log("++++++++++++++++++++++++", data_)

    chinhSuaGioiHanForm.setFieldsValue({
      net_rxkBs_min: data_?.net_rxkBs_min,
      net_rxkBs_max: data_?.net_rxkBs_max,
      net_txkBs_min: data_?.net_txkBs_min,
      net_txkBs_max: data_?.net_txkBs_max,
      net_tpcks_min: data_?.net_tpcks_min,
      net_tpcks_max: data_?.net_tpcks_max,
      net_rpcks_min: data_?.net_rpcks_min,
      net_rpcks_max: data_?.net_rpcks_max,
      io_rkbs_min: data_?.io_rkbs_min,
      io_rkbs_max: data_?.io_rkbs_max,
      io_wkbs_min: data_?.io_wkbs_min,
      io_wkbs_max: data_?.io_wkbs_max,
    });

    setModalChinhSuaGioiHanVisible(true);
  };

  const handleChinhSuaGioiHanOk = () => {
    chinhSuaGioiHanForm
      .validateFields()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then((values) => {
        // Submit Form
        chinhSuaGioiHanForm.submit();
        setModalChinhSuaGioiHanVisible(false);
      })
      .catch((errInfo) => {
        // eslint-disable-next-line no-console
        console.log('Error===>', errInfo);
      });
  };

  const handleChinhSuaGioiHanCancel = () => {
    setModalChinhSuaGioiHanVisible(false);
  };

  const onChinhSuaGioiHanFormFinish = (id: any, values: any) => {
    console.log('id', id);
    console.log('values', values);
    const formChinhSuaGioiHan = document.getElementById('formChinhSuaGioiHan') as HTMLFormElement;
    const formData = new FormData(formChinhSuaGioiHan);
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });
    devices.updateGioiHanData(id, values);
  };

  const updateAllChartData = (data) => {
    setDataChartCPU((oldArray) => {
      const newData = {
        category: 'CPU',
        time: moment(data?.resource_info?.timestamps).format('HH:mm:ss'),
        value: data?.resource_info?.['PERCENT_CPU'] ?? '0',
      };

      if (compareTwoPoint(oldArray[oldArray.length - 1], newData)) return oldArray;
      else {
        const tmp = [...oldArray, newData];
        const tail = ([x, ...res]) => res;
        console.log('tmp', tmp);

        console.log(
          'tail',
          tail(tmp).sort((a, b) => a - b),
        );
        const arr = tail(tmp).sort((a, b) => a - b);
        const arr2 = arr.filter(
          (item, index) => arr.findIndex((e) => e.time === item.time) === index,
        );
        // return tail(tmp).sort((a, b) => a - b);
        return arr2;
      }
    });

    setDataChartRAM((oldArray) => {
      const newData = {
        category: 'RAM',
        time: moment(data?.resource_info?.timestamps).format('HH:mm:ss'),
        value: data?.resource_info?.['PERCENT_RAM'] ?? '0',
      };

      if (compareTwoPoint(oldArray[oldArray.length - 1], newData)) return oldArray;
      else {
        const tmp = [...oldArray, newData];
        const tail = ([x, ...res]) => res;
        const arr = tail(tmp).sort((a, b) => a - b);
        const arr2 = arr.filter(
          (item, index) => arr.findIndex((e) => e.time === item.time) === index,
        );
        return arr2;
        // return tail(tmp).sort((a, b) => a - b);
      }
    });

    setDataChartSPEEDUP((oldArray) => {
      const newData = {
        category: 'SPEED_UP',
        time: moment(data?.resource_info?.timestamps).format('HH:mm:ss'),
        value: data?.resource_info?.['SPEED_UP'] ?? '0',
      };

      if (compareTwoPoint(oldArray[oldArray.length - 1], newData)) return oldArray;
      else {
        const tmp = [...oldArray, newData];
        const tail = ([x, ...res]) => res;
        const arr = tail(tmp).sort((a, b) => a - b);
        const arr2 = arr.filter(
          (item, index) => arr.findIndex((e) => e.time === item.time) === index,
        );
        return arr2;
        //   return tail(tmp).sort((a, b) => a - b);
      }
    });

    setDataChartSPEEDDOWN((oldArray) => {
      const newData = {
        category: 'SPEED_DOWN',
        time: moment(data?.resource_info?.timestamps).format('HH:mm:ss'),
        value: data?.resource_info?.['SPEED_DOWN'] ?? '0',
      };

      if (compareTwoPoint(oldArray[oldArray.length - 1], newData)) return oldArray;
      else {
        const tmp = [...oldArray, newData];
        const tail = ([x, ...res]) => res;
        const arr = tail(tmp).sort((a, b) => a - b);
        const arr2 = arr.filter(
          (item, index) => arr.findIndex((e) => e.time === item.time) === index,
        );
        return arr2;
        // return tail(tmp).sort((a, b) => a - b);
      }
    });
  };

  const handleReloadAlertById = (idDevice, type) => {
    device?.getAlertById({
      device: idDevice,
      page: 1,
      page_size: 10,
      type,
    });
  };

  useEffect(() => {
    const socket = new ReconnectingWebSocket(`ws://${socketIP}/ws/chat/alerts/`);

    if (socket) {
      socket.onmessage = function (e) {
        let data = JSON.parse(e.data);
        // console.log('data', e.data);

        // if (data.type === 'processlist') console.log(data)
        if (
          data.type === 'processlist' &&
          parseInt(data?.message?.device_id) === parseInt(idDevice)
        ) {
          // console.log(data)
          setProcesslistFromWS(
            data?.message?.data?.map((el, index) => ({ ...el, index: index + 1 })),
          );
        }
        if (data.type === 'devices') {
          data =
            data?.message?.filter((e) => {
              return e.id === parseInt(idDevice);
            })?.[0] ?? {};
          setShow(!show);
          setDataSocket(data);
          device?.getData(idDevice, undefined, undefined);
          // devices?.getDataById(idDevice);
          devices.setRecord(data);
          // devices.getListTrackIp({
          //   device_id: data?.id ?? '',
          //   page: 1,
          //   page_size: 10,
          // })
          // devices.getAllListTrackIp({
          //   ip: data?.ip ?? '',
          //   page: 1,
          //   page_size: 10000,
          // })
          devices.setRecordClone(data);

          updateAllChartData(data);

          // Nếu hiện tại đang ko trace syscall nữa thì đóng modal
          // if (data?.tracing_syscall ?? '' === '') setVisibleModalSyscall(false);
        }
        if (data.type === 'syscall') {
          setArrModalSyscall((arrModalSyscall) => [...arrModalSyscall, data?.message ?? '']);
        }

        // if (data.type === 'alerts') {
        // console.log(`data`, data);
        // if (data.typeAlert === 'LOG' && data.pid === '-1') setVisibleModalSyscall(false);
        // }
      };
    }
    devices?.getDataById(idDevice);
    return () => {
      if (socket != null) {
        socket.close();
      }
    };
  }, []);
  const traceCall = (device_id: string, pid: string) => {
    setVisibleModalSyscall(true);
    device.startTrace(device_id, pid);
    devices.getDataById(idDevice);
  };
  const stopCall = (device_id: string, pid: string) => {
    device.stopTrace(device_id, pid);
    devices.getDataById(idDevice);
  };
  const columnsProcess = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'PID',
      dataIndex: 'pid',
      key: 'pid',
      align: 'center',
    },
    {
      title: 'Comm',
      dataIndex: 'comm',
      key: 'comm',
      align: 'center',
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      align: 'center',
    },
    {
      title: 'PPID',
      dataIndex: 'ppid',
      key: 'ppid',
      align: 'center',
    },
    {
      title: 'Utime',
      dataIndex: 'utime',
      key: 'utime',
      align: 'center',
      // render: val => moment(val).format('DD/MM/YYYY hh:mm:ss')
    },
    {
      title: 'Stime',
      dataIndex: 'stime',
      key: 'stime',
      align: 'center',
      // render: val => moment(val).format('DD/MM/YYYY hh:mm:ss')
    },
    {
      title: 'Cutime',
      dataIndex: 'cutime',
      key: 'cutime',
      align: 'center',
      // render: val => moment(val).format('DD/MM/YYYY hh:mm:ss')
    },
    {
      title: 'Cstime',
      dataIndex: 'cstime',
      key: 'cstime',
      align: 'center',
      // render: val => moment(val).format('DD/MM/YYYY hh:mm:ss')
    },
    {
      title: 'Num threads',
      dataIndex: 'num_threads',
      key: 'num_threads',
      align: 'center',
    },
    {
      title: 'Vsize',
      dataIndex: 'vsize',
      key: 'vsize',
      align: 'center',
    },
    {
      title: 'Rss',
      dataIndex: 'rss',
      key: 'rss',
      align: 'center',
    },
    {
      title: 'Sha1',
      dataIndex: 'sha1',
      key: 'sha1',
      align: 'center',
    },
    {
      title: 'Thao tác',
      dataIndex: 'thaotac',
      key: 'thaotac',
      align: 'center',
      width: 180,
      fixed: 'right',
      render: (val, record) => {
        return (
          <>
            {devices?.record?.tracing_syscall != record?.pid ? (
              <Button
                title="Theo dõi syscall"
                type="primary"
                icon={<FileSearchOutlined />}
                shape="circle"
                onClick={() => traceCall(idDevice, record?.pid ?? '')}
              ></Button>
            ) : (
              <Button
                title="Dừng theo dõi"
                type="danger"
                icon={<CloseCircleOutlined />}
                shape="circle"
                onClick={() => stopCall(idDevice, record?.pid ?? '')}
              ></Button>
            )}
          </>
        );
      },
    },
  ];
  // const dataTable = device?.data?.map((item, index) => ({
  //   ...item,
  //   index: index + 1,
  // }));
  // console.log("dataTable", dataTable)
  const columnsSys = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Syscall',
      dataIndex: 'syscall',
      key: 'syscall',
      align: 'center',
    },
    {
      title: 'Params',
      dataIndex: 'params',
      key: 'params',
      align: 'center',
    },
    {
      title: 'PID',
      dataIndex: 'pid',
      key: 'pid',
      align: 'center',
    },
    {
      title: 'Timestamp',
      dataIndex: 'created',
      key: 'timestamp',
      align: 'center',
      render: (val: string) => moment(new Date(val)).format('DD/MM/YYYY HH:mm:ss'),
    },
  ];

  const columnsAlert = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      align: 'center',
    },

    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
      width: 80,
      align: 'center',
    },

    {
      title: 'Nội dung',
      dataIndex: 'message',
      key: 'message',
      width: 200,
      align: 'center',
    },

    {
      title: 'Hash',
      dataIndex: 'hash',
      key: 'hash',
      width: 80,
      align: 'center',
    },

    {
      title: 'PID',
      dataIndex: 'pid',
      key: 'pid',
      width: 80,
      align: 'center',
    },

    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 80,
      align: 'center',
      render: (value: string) => moment(new Date(value)).format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      title: 'Thao tác',
      dataIndex: 'thaotac',
      key: 'thaotac',
      align: 'center',
      width: 300,
      fixed: 'right',
      render: (val, record) => {
        return (
          <>
            <Button
              title="Ngắt tiến trình"
              type="danger"
              icon={<CloseCircleOutlined />}
              shape="circle"
              disabled={record?.type !== 'MALWARE'}
              onClick={() =>
                device.killProcess(record?.id ?? '', recordDevice?.id ?? '', record?.pid ?? '')
              }
            ></Button>
            <Divider type="vertical" />
            <Button
              title="Khởi động lại"
              icon={<RedoOutlined />}
              shape="circle"
              onClick={() => {
                device.rebootDevice(recordDevice?.id ?? '');
              }}
            // style={{ backgroundColor: 'yellow', color: 'black' }}
            ></Button>
            <Divider type="vertical" />
            <Button
              title="Đổi mật khẩu telnet"
              icon={<EditOutlined />}
              shape="circle"
            // onClick={() => {
            //   device.rebootDevice(recordDevice?.id ?? '');
            // }}
            ></Button>
          </>
        );
      },
    },
  ];

  const columnsTrackIp = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      align: 'center',
      hideInSearch: true,
    },
    {
      title: 'Địa chỉ IP',
      dataIndex: 'ip_tracking',
      key: 'ip_tracking',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tần suất truy cập',
      dataIndex: 'count',
      key: 'count',
      width: 80,
      align: 'center',
      hideInSearch: true,
    },
  ];

  const columnsIntegrity = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Thông báo',
      dataIndex: 'message',
      key: 'index',
      width: 80,
      align: 'center',
    },
  ];

  const handleReloadIPS = () => {
    setIpSearch('');
    const record = devices?.record ?? '';
    devices.getListTrackIp({
      device_id: record?.id ?? '',
      current: 1,
      page_size: 10,
    });
  };

  const handleReloadProcess = () => {
    setProcessSearch('');
    device?.getData(idDevice, undefined, undefined);
    setVirussTotalFilter(false);
    console.log(device.data);
    devices?.getDataById(idDevice);
  }

  const handleToggleVirussTotalFilter = () => {
    // setProcessSearch('');
    if (virussTotalFilter) {
      device?.getData(idDevice, processSearch, !virussTotalFilter);
      console.log(device.data);
      devices?.getDataById(idDevice);
    } else {
      device?.getData(idDevice, processSearch, !virussTotalFilter);
      console.log(device.data);
      devices?.getDataById(idDevice);
    }
    setVirussTotalFilter(!virussTotalFilter);
  }

  const changeTabPane = (value) => {
    setvalueTabPane(value);
    const record = devices?.record ?? '';
    if (value === 'chart') {
      device?.getData(idDevice, undefined, undefined);
      devices.getDataById(idDevice, (data) => {
        updateAllChartData(data);
      });
    }
    if (value === 'process') {
      device?.getData(idDevice, undefined, undefined);
      console.log(device.data);
      devices?.getDataById(idDevice);
    }
    if (value === 'syscall') {
      device?.getDataSyscall(idDevice);
    }
    if (value === 'alerts') {
      handleReloadAlertById(devices?.record?.id);
    }
    if (value === 'track') {
      // devices?.getDataById(idDevice);
      devices.getListTrackIp({
        device_id: record?.id ?? '',
        current: 1,
        page_size: 10,
      });
      // devices.getAllListTrackIp({
      //   ip: record?.ip ?? '',
      //   page: 1,
      //   page_size: 10000,
      // })
    }
    if (value === 'integrity') {
      integrity.getData(idDevice);
    }
  };

  const changeTypeAlert = (type) => {
    setTypeAlert(type);
    const record = devices?.record ?? '';
    if (type === 0) {
      handleReloadAlertById(devices?.record?.id);
    } else {
      handleReloadAlertById(devices?.record?.id, type);
    }
  };
  const dataInit = dataSocket === null ? recordDevice : dataSocket;

  const searchIp = (e) => {
    setIpSearch(e.target.value);
    if (!e.target.value) {
      devices.setListTrackIp(devices.listTrackIpClone);
      return;
    }
    let arr = Array.from(devices.listTrackIpClone);
    arr = arr.filter((item) => item.ip_tracking === e.target.value);
    devices.setListTrackIp(arr);
  };

  const searchProcess = (e) => {
    setProcessSearch(e.target.value);
    if (!e.target.value) {
      device?.getData(idDevice, undefined, virussTotalFilter);
      return;
    }
    device?.getData(idDevice, e.target.value, virussTotalFilter);
  };

  const traceNetwork = (idDevice) => {
    device.startTraceNetwork(idDevice);
  };

  const stopTraceNetwork = (idDevice) => {
    device.stopTraceNetwork(idDevice);
  };
  // console.log(devices?.listTrackIp, 'socket');
  return (
    <div>
      <DrawerSyscall
        deviceName={name}
        id={devices?.record?.id}
        pid={devices?.record?.tracing_syscall}
      />
      <Card>
        <Breadcrumb>
          <Breadcrumb.Item
            onClick={() => {
              history.back();
            }}
          >
            <b style={{ cursor: 'pointer' }}>
              <ArrowLeftOutlined />
              Quay lại
            </b>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <b>Thiết bị: {name}</b>
          </Breadcrumb.Item>
        </Breadcrumb>
        <br />
        <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 3, md: 1, sm: 1, xs: 1 }}>
          <Descriptions.Item label="CPU">
            <Animate showProp="show" transitionName="fade">
              <Div show={show} className="code-box-shape">
                <iframe src={`${DashboardBlank}/d-solo/000000029/demo-kc?orgId=1&from=now-5m&to=now&refresh=5s&var-Interval=%24__auto_interval_Interval&var-device_id=device_id%7C%3D%7C${idDevice}&panelId=66`} frameborder="0" style={{ width: '100%', height: '100%' }} ></iframe>
              </Div>
            </Animate>
          </Descriptions.Item>
          <Descriptions.Item label="Receive bytes" span={2}>
            <Animate showProp="show" transitionName="fade">
              <Div show={show} className="code-box-shape">
                <iframe src={`${DashboardBlank}/d-solo/000000029/demo-kc?orgId=1&from=now-5m&to=now&refresh=5s&var-Interval=%24__auto_interval_Interval&var-device_id=device_id%7C%3D%7C${idDevice}&panelId=71`} frameborder="0" style={{ width: '100%', height: '100%' }} ></iframe>
              </Div>
            </Animate>
          </Descriptions.Item>
          <Descriptions.Item label="Ram">
            <Animate showProp="show" transitionName="fade">
              <Div show={show} className="code-box-shape">
                <iframe src={`${DashboardBlank}/d-solo/000000029/demo-kc?orgId=1&from=now-5m&to=now&refresh=5s&var-Interval=%24__auto_interval_Interval&var-device_id=device_id%7C%3D%7C${idDevice}&panelId=67`} frameborder="0" style={{ width: '100%', height: '100%' }} ></iframe>
              </Div>
            </Animate>
          </Descriptions.Item>
          <Descriptions.Item label="Transmit bytes" span={2}>
            <Animate showProp="show" transitionName="fade">
              <Div show={show} className="code-box-shape">
                <iframe src={`${DashboardBlank}/d-solo/000000029/demo-kc?orgId=1&from=now-5m&to=now&refresh=5s&var-Interval=%24__auto_interval_Interval&var-device_id=device_id%7C%3D%7C${idDevice}&panelId=72`} frameborder="0" style={{ width: '100%', height: '100%' }} ></iframe>
              </Div>
            </Animate>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Animate showProp="show" transitionName="fade">
              <Div show={show} className="code-box-shape">
                <Badge
                  status={dataInit?.agentInstalled ? 'processing' : 'error'}
                  text={dataInit?.agentInstalled ? 'Đang theo dõi' : 'Chưa theo dõi'}
                />
              </Div>
            </Animate>
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ MAC" span={2}>
            <Animate showProp="show" transitionName="fade">
              <Div show={show} className="code-box-shape">
                {devices?.record?.mac_addr ?? ''}
              </Div>
            </Animate>
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ IP">
            <Animate showProp="show" transitionName="fade">
              <Div show={show} className="code-box-shape">
                {devices?.record?.ip ?? ''}
              </Div>
            </Animate>
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ thiết bị" span={2}>
            <Animate showProp="show" transitionName="fade">
              <Div show={show} className="code-box-shape">
                {devices?.record?.address ?? ''}
              </Div>
            </Animate>
          </Descriptions.Item>

          <Descriptions.Item label="Theo dõi syscall">
            <Animate showProp="show" transitionName="fade">
              <Div show={show}>
                {(dataInit?.tracing_syscall ?? '') === '' ? (
                  <Alert message="Hiện đang chưa theo dõi tiến trình nào" type="info" showIcon />
                ) : (
                  <Alert
                    message={`Đang theo dõi tiến trình: ${dataInit?.tracing_syscall}`}
                    type="success"
                    showIcon
                  />
                )}
                {(dataInit?.tracing_syscall ?? '') !== '' && (
                  <>
                    <Divider />

                    <Button
                      type="primary"
                      onClick={() => stopCall(idDevice, recordDevice?.pid ?? '')}
                    >
                      Dừng theo dõi
                    </Button>
                    <Divider type="vertical" />
                    <Button type="primary" onClick={() => setVisibleModalSyscall(true)}>
                      Xem chi tiết
                    </Button>
                  </>
                )}
              </Div>
            </Animate>
          </Descriptions.Item>

          <Descriptions.Item label="Theo dõi network" span={2}>
            <Animate showProp="show" transitionName="fade">
              <Div show={show} className="code-box-shape">
                {devices?.record?.tracing_network === false ? (
                  <Button type="primary" onClick={() => traceNetwork(idDevice)} style={{ marginRight: "20px" }}>
                    Theo dõi
                  </Button>
                ) : (
                  <Button type="primary" onClick={() => stopTraceNetwork(idDevice)} style={{ marginRight: "20px" }}>
                    Dừng
                  </Button>
                )}
                <Button type="primary" onClick={async () => await showModalChinhSuaGioiHan(idDevice)}>
                  Chỉnh sửa độ chịu tải thiết bị
                </Button>
              </Div>
            </Animate>
          </Descriptions.Item>
        </Descriptions>
        <br />

        <Tabs onChange={changeTabPane} destroyInactiveTabPane={true}>
          <Tabs.TabPane key="chart" tab="Tài nguyên">
            {valueTabPane === 'chart' && (
              <Row>
                <Col md={12} xs={24}>
                  {/* <Card title="CPU History" bordered={false}>
                    <ChartLine
                      data={dataChartCPU}
                      otherProps={{
                        yAxis: {
                          label: {
                            formatter: function formatter(v) {
                              return `${v} %`;
                            },
                          },
                        },
                      }}
                    />
                  </Card> */}
                  <div style={{ height: '20rem' }}>
                    <iframe src={`${DashboardBlank}/d-solo/000000029/demo-kc?orgId=1&from=now-5m&to=now&refresh=5s&var-Interval=%24__auto_interval_Interval&var-device_id=device_id%7C%3D%7C${idDevice}&panelId=68`} frameborder="0" style={{ width: '100%', height: '100%' }} ></iframe>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  {/* <Card title="RAM" bordered={false}>
                    <ChartLine
                      data={dataChartRAM}
                      otherProps={{
                        yAxis: {
                          label: {
                            formatter: function formatter(v) {
                              return `${v} %`;
                            },
                          },
                        },
                      }}
                    />
                  </Card> */}
                  <div style={{ height: '20rem' }}>
                    <iframe src={`${DashboardBlank}/d-solo/000000029/demo-kc?orgId=1&from=now-5m&to=now&refresh=5s&var-Interval=%24__auto_interval_Interval&var-device_id=device_id%7C%3D%7C${idDevice}&panelId=70`} frameborder="0" style={{ width: '100%', height: '100%' }} ></iframe>
                  </div>
                </Col>
                <Col xs={24}>
                  {/* <Card title="SPEED" bordered={false}>
                    <ChartLine
                      data={dataChartSPEEDUP.concat(dataChartSPEEDDOWN)}
                      otherProps={{
                        yAxis: {
                          label: {
                            formatter: function formatter(v) {
                              return `${v} KB/s`;
                            },
                          },
                        },
                      }}
                    />
                  </Card> */}
                  <div style={{ height: '20rem' }}>
                    <iframe src={`${DashboardBlank}/d-solo/000000029/demo-kc?orgId=1&from=now-5m&to=now&refresh=5s&var-Interval=%24__auto_interval_Interval&var-device_id=device_id%7C%3D%7C${idDevice}&panelId=69`} frameborder="0" style={{ width: '100%', height: '100%' }} ></iframe>
                  </div>
                </Col>
              </Row>
            )}
          </Tabs.TabPane>

          <Tabs.TabPane key="process" tab="Tiến trình">
            {valueTabPane === 'process' && (
              <Card bordered>
                <Row style={{ display: 'flex', justifyContent: "space-between" }}>
                  <Col xs={24} md={12} style={{ flex: 1, marginRight: 20 }}>
                    <Input
                      onChange={searchProcess}
                      value={processSearch}
                      placeholder="PID / SHA1"
                      allowClear
                      style={{ marginBottom: 15, width: '100%' }}
                      addonBefore="Tìm kiếm"
                    />
                  </Col>
                  <Col style={{ display: 'flex', justifyContent: "space-between", width: '20%', flexWrap: 'wrap' }}>
                    <Button type="primary" onClick={() => handleReloadProcess()}>
                      Làm mới dữ liệu
                    </Button>
                    {
                      virussTotalFilter ? (
                        <Button type="primary" onClick={() => handleToggleVirussTotalFilter()}>
                          Tắt lọc tiến trình
                        </Button>
                      ) : (
                        <Button type="primary" onClick={() => handleToggleVirussTotalFilter()}>
                          Lọc tiến trình
                        </Button>
                      )
                    }
                  </Col>
                </Row>
                <Table
                  loading={device.loading || false}
                  bordered
                  columns={columnsProcess}
                  dataSource={(device?.data ?? []).map((item, index) => ({
                    ...item,
                    index: index + 1,
                  }))}
                  scroll={{
                    x: 1000,
                  }}
                />
              </Card>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane key="syscall" tab="Lời gọi hệ thống">
            {valueTabPane === 'syscall' && (
              <Table
                loading={device?.loading || devices?.loading || false}
                bordered
                columns={columnsSys}
                dataSource={device?.syscall?.map((item, index) => ({
                  ...item,
                  index: index + 1,
                }))}
                scroll={{
                  x: 1000,
                }}
              />
            )}
          </Tabs.TabPane>

          <Tabs.TabPane key="alerts" tab="Cảnh báo">
            {valueTabPane === 'alerts' && (
              <Card
                title={
                  <Select defaultValue={0} onChange={changeTypeAlert} style={{ width: 300 }}>
                    <Select.Option value={0}>Tất cả các loại cảnh báo</Select.Option>
                    <Select.Option value={TYPE_ALERT.NETWORK}>{TYPE_ALERT.NETWORK}</Select.Option>
                    <Select.Option value={TYPE_ALERT.SYSCALL}>{TYPE_ALERT.SYSCALL}</Select.Option>
                    <Select.Option value={TYPE_ALERT.MALWARE}>{TYPE_ALERT.MALWARE}</Select.Option>
                    <Select.Option value={TYPE_ALERT.LOG}>{TYPE_ALERT.LOG}</Select.Option>
                  </Select>
                }
              >
                <Table
                  // loading={device?.loading || devices?.loading || false}
                  bordered
                  columns={columnsAlert}
                  dataSource={(device?.alerts?.results ?? []).map((item, index) => ({
                    ...item,
                    index: index + 1,
                  }))}
                  // dataSource={[
                  //   {
                  //     index: 1,
                  //   },
                  // ]}
                  pagination={{
                    total: device?.alerts?.count ?? 0,
                    pageSize: 10,
                    onChange: (page, pageSize) => {
                      if (typeAlert === 0) {
                        device.getAlertById({
                          device: devices?.record?.id ?? '',
                          page,
                          page_size: pageSize,
                        });
                      } else {
                        device.getAlertById({
                          device: devices?.record?.id ?? '',
                          page,
                          page_size: pageSize,
                          type: typeAlert,
                        });
                      }
                    },
                  }}
                  scroll={{
                    x: 1000,
                  }}
                />
              </Card>
            )}
          </Tabs.TabPane>

          <Tabs.TabPane key="track" tab="Theo dõi ip">
            {valueTabPane === 'track' && (
              <Row>
                <Col xs={24} md={16}>
                  <Input
                    onChange={searchIp}
                    value={ipSearch}
                    placeholder="Địa chỉ ip"
                    allowClear
                    style={{ marginBottom: 15, marginRight: 20, width: '70%' }}
                    addonBefore="Tìm kiếm"
                  />
                  <Button type="primary" onClick={() => handleReloadIPS()}>
                    Cập nhật
                  </Button>
                </Col>

                <Col xs={24} md={16}>
                  <Table
                    loading={devices?.loading || false}
                    bordered
                    columns={columnsTrackIp}
                    dataSource={devices?.listTrackIp
                      ?.sort((a, b) => {
                        return b.count - a.count;
                      })
                      .map((val, ind) => ({
                        ...val,
                        index:
                          ind +
                          1 +
                          ((devices?.pagingListTrackIp?.current ?? 1) - 1) *
                          (devices?.pagingListTrackIp?.pageSize ?? 10),
                      }))}
                    scroll={{
                      x: 700,
                    }}
                    pagination={{
                      total: devices?.pagingListTrackIp?.total ?? 0,
                      // current: devices?.pagingListTrackIp?.current ?? 1,
                      pageSize: devices?.pagingListTrackIp?.pageSize ?? 10,
                      onChange: (page, pageSize) => {
                        devices.getListTrackIp({
                          device_id: devices.record?.id ?? '',
                          current: page,
                          page_size: pageSize,
                        });
                      },
                    }}
                  />
                </Col>

                <Col xs={24} md={8}>
                  <Card title="Thống kê">
                    {/* <DemoWordCloud
                      dataSource={Object.keys(devices?.record?.ips ?? {}).map((ip, index) => {
                        let newItem = {};
                        newItem.index = index + 1;
                        (newItem.x = ip), (newItem.value = devices?.record?.ips[ip]);
                        return newItem;
                      })}
                    /> */}
                    <DemoPie
                      data={devices?.listTrackIp
                        ?.map((item, index) => {
                          let newItem = {};
                          newItem.index = index + 1;
                          (newItem.ip = item?.ip_tracking ?? ''),
                            (newItem.value = item?.count ?? 0);
                          return newItem;
                        })
                        .sort((a, b) => {
                          return b.value - a.value;
                        })}
                    />
                  </Card>
                </Col>
              </Row>
            )}
          </Tabs.TabPane>

          <Tabs.TabPane key="integrity" tab="Kiểm tra tính toàn vẹn">
            {valueTabPane === 'integrity' && (
              <Table
                loading={devices?.loading || false}
                bordered
                columns={columnsIntegrity}
                dataSource={(integrity?.data ?? []).map((item, index) => ({
                  ...item,
                  index: index + 1,
                }))}
                scroll={{
                  x: 1000,
                }}
              />
            )}
          </Tabs.TabPane>

          <Tabs.TabPane key="openingport" tab="Các cổng đang mở">
            <div>
              <pre>
                {JSON.stringify(devices?.record?.resource_info?.OPENING_PORT ?? {}, null, 2)}
              </pre>
            </div>
          </Tabs.TabPane>
          {(devices?.record?.device_type == "hardware") && (<Tabs.TabPane key="blackwhitelistip" tab="Danh sách kiểm soát IP">
            <BlackListIp idDevice={idDevice} />
            <WhiteListIp idDevice={idDevice} />
          </Tabs.TabPane>)}
        </Tabs>
      </Card>
      {/* Modal Chỉnh sửa GioiHan*/}
      <Modal
        title={`Chỉnh sửa thông tin độ chịu tải thiết bị`}
        visible={isModalChinhSuaGioiHanVisible}
        onOk={handleChinhSuaGioiHanOk}
        onCancel={handleChinhSuaGioiHanCancel}
        width={600}
        key={idDevice}
      >
        <Form
          id="formChinhSuaGioiHan"
          {...formItemLayout}
          form={chinhSuaGioiHanForm}
          name="control-hooks"
          onFinish={(values) => onChinhSuaGioiHanFormFinish(idDevice, values)}
        >
          <Form.Item label="Net_rxkBs_min" name="net_rxkBs_min">
            <Input placeholder="Net_rxkBs_min" />
          </Form.Item>
          <Form.Item label="Net_rxkBs_max" name="net_rxkBs_max">
            <Input placeholder="Net_rxkBs_max" />
          </Form.Item>
          <Form.Item label="Net_txkBs_min" name="net_txkBs_min">
            <Input placeholder="Net_txkBs_min" />
          </Form.Item>
          <Form.Item label="Net_txkBs_max" name="net_txkBs_max">
            <Input placeholder="Net_txkBs_max" />
          </Form.Item>
          <Form.Item label="Net_tpcks_min" name="net_tpcks_min">
            <Input placeholder="Net_tpcks_min" />
          </Form.Item>
          <Form.Item label="Net_tpcks_max" name="net_tpcks_max">
            <Input placeholder="Net_tpcks_max" />
          </Form.Item>
          <Form.Item label="Net_rpcks_min" name="net_rpcks_min">
            <Input placeholder="Net_rpcks_min" />
          </Form.Item>
          <Form.Item label="Net_rpcks_max" name="net_rpcks_max">
            <Input placeholder="Net_rpcks_max" />
          </Form.Item>
          <Form.Item label="Io_rkbs_min" name="io_rkbs_min">
            <Input placeholder="Io_rkbs_min" />
          </Form.Item>
          <Form.Item label="Io_rkbs_max" name="io_rkbs_max">
            <Input placeholder="Io_rkbs_max" />
          </Form.Item>
          <Form.Item label="Io_wkbs_min" name="io_wkbs_min">
            <Input placeholder="Io_wkbs_min" />
          </Form.Item>
          <Form.Item label="Io_wkbs_max" name="io_wkbs_max">
            <Input placeholder="Io_wkbs_max" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Device;
