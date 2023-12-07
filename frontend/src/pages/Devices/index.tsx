/* eslint-disable @typescript-eslint/ban-types */
import React, { useEffect, useState, useRef, Fragment } from 'react';
import styles from './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import notificationAlert from '@/components/Notification';
import {
  Card,
  Row,
  Col,
  Tooltip,
  Divider,
  Checkbox,
  Popover,
  Radio,
  Tag,
  Modal,
  Button,
  Form,
  Input,
  Spin,
  Popconfirm,
  InputNumber,
  Switch,
  Select,
  Table,
} from 'antd';
import {
  StopOutlined,
  EditOutlined,
  FormOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  AppstoreOutlined,
  AppstoreTwoTone,
  DatabaseOutlined,
  DatabaseTwoTone,
  EyeOutlined,
  SettingOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
} from '@ant-design/icons';
import ava1 from './img/ipcam.jpg';
import { useModel, history } from 'umi';
import { ip, socketIP, rawIP } from '@/services/ip';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { request } from 'umi';
import BlackListIp from '@/pages/QuanLyDanhSachIp/BlackListIp';
import WhiteListIp from '@/pages/QuanLyDanhSachIp/WhiteListIp';
import DefaultDeviceImg from './img/device.jpg';
import rules from '@/utils/rules';
import { ActionType } from '@ant-design/pro-table';

const { Meta } = Card;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const Devices: React.FC<{}> = () => {
  let chatSocket: WebSocket;
  const actionRef = useRef<ActionType>();
  const [isModalChinhSuaVisible, setModalChinhSuaVisible] = useState(false);
  const [isModalThemMoiVisible, setModalThemMoiVisible] = useState(false);
  const [clickedCard, setClickedCard] = useState({
    name: '',
    username: '',
    password: '',
    id: '',
  });
  const [typeLayout, setTypeLayout] = useState(false);
  const [visible, setVisible] = useState(false);
  const {
    selectedRowKeys,
    setSelectedRowKeys,
    hasSelectKey,
    setHasSelectKey,
    hasSelectKeyIP,
    setHasSelectKeyIP,
    listDevicesBlackList,
    setListDevicesBlackList,
    listDevicesWhiteList,
    setListDevicesWhiteList,
    addListIPToDevices,
  } = useModel('devices');
  const devices = useModel('devices');
  const device = useModel('processlist');
  const agents = useModel('agents');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const alerts = useModel('alerts');
  const device_detail = useModel('device_detail');
  const [hwagentOrOs, setHwagentOrOs] = useState(true);
  const [autoUpdatePasswd, setAutoUpdatePassword] = useState(false);
  const [listIP, setListIP] = useState([]);

  let dataSource = devices.data?.map((item, index) => ({
    ...item,
    index: index + 1,
    key: index,
  }));
  // dataSource = dataSource.concat(dataSource);
  // dataSource = dataSource.concat(dataSource);
  // dataSource = dataSource?.map((item, index) => ({
  //       ...item,
  //       index: index + 1,
  //       key: index,
  //     }));
  useEffect(() => {
    devices.getData();
    console.log('data', devices.data);
  }, []);

  useEffect(() => {
    chatSocket = new ReconnectingWebSocket(`ws://${socketIP}/ws/chat/alerts/`);
    chatSocket.onmessage = function (e) {
      const data = JSON.parse(e.data);

      if (data.type === 'devices') {
        // console.log('data :>> ', data);
        data?.message?.forEach((device) => {
          if (!device?.avatar.includes('http')) {
            device.avatar = `${rawIP}${device.avatar}`;
          }
        });
        devices.setData(
          (data?.message ?? []).map((item) => ({
            ...item,
            agentInstalledInit: item?.agentInstalled ?? false,
          })),
        );
      }
    };
    return () => {
      chatSocket.close();
    };
  }, []);

  const [themMoiForm] = Form.useForm();
  const [chinhSuaForm] = Form.useForm();

  const [form] = Form.useForm();

  const showModalChinhSua = (el: any) => {
    setClickedCard(el);
    setHwagentOrOs(el?.hwagentOrOs ?? false);
    setAutoUpdatePassword(el?.autoUpdatePasswd ?? false);

    chinhSuaForm.setFieldsValue({
      name: el?.name,
      device_type: el?.device_type,
      agent_name: el?.agent_name,
      ip: el?.ip,
      protocol: el?.protocol,
      address: el?.address,
      mac_addr: el?.mac_addr,
      username: el?.username,
      password: el?.password,
      port: el?.port,
      os: el?.os,
      hwagent: el?.hwagent,
      remote_port: el?.remote_port,
      from_internet: el?.from_internet,
      hwagentOrOs: el?.hwagentOrOs ?? false,
      autoUpdatePasswd: el?.autoUpdatePasswd ?? false,
    });

    setModalChinhSuaVisible(true);
  };


  const showModalThemMoi = () => {
    // Reset form về ban đầu
    setHwagentOrOs(true);
    setAutoUpdatePassword(false);
    themMoiForm.resetFields();
    setModalThemMoiVisible(true);
  };

  const handleChinhSuaOk = () => {
    chinhSuaForm
      .validateFields()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then((values) => {
        // Submit Form
        chinhSuaForm.submit();
        setModalChinhSuaVisible(false);
      })
      .catch((errInfo) => {
        // eslint-disable-next-line no-console
        console.log('Error===>', errInfo);
      });
  };

  const handleThemMoiOk = () => {
    themMoiForm
      .validateFields()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then((values) => {
        // Submit Form
        themMoiForm.submit();
        console.log(themMoiForm.getFieldsValue());
        themMoiForm.setFieldsValue({
          autoUpdatePasswd: autoUpdatePasswd,
          hwagentOrOs: hwagentOrOs,
        });
        setModalThemMoiVisible(false);
      })
      .catch((errorInfo) => {
        // eslint-disable-next-line no-console
        console.log('Error==>', errorInfo);
      });
  };

  const handleThemMoiCancel = () => {
    setModalThemMoiVisible(false);
  };

  const handleChinhSuaCancel = () => {
    setModalChinhSuaVisible(false);
  };

  const onThemMoiFormFinish = (values: any) => {
    const themMoiForm = document.getElementById('themMoiForm') as HTMLFormElement;
    const formData = new FormData(themMoiForm);
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });
    devices.createData(formData);
  };

  const onChinhSuaFormFinish = (id: any, values: any) => {
    console.log('values', values);
    const formChinhSua = document.getElementById('formChinhSua') as HTMLFormElement;
    const formData = new FormData(formChinhSua);
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });
    devices.updateData(id, formData);
  };

  const onDeleteDevice = (el: any) => {
    devices.deleteData(el.id);
  };

  const onReloadDevice = (el: any) => {
    devices.reloadDevice(el.id);
  };

  const onIsolateDevice = (el: any) => {
    devices.isolateDevice(el.id);
  };

  const onInstallDevice = (el: any) => {
    agents.install(el.id);
  };

  const onUninstallDevice = (id: any) => {
    agents.kill(id);
  };

  const traceNetwork = (idDevice) => {
    device_detail.startTraceNetwork(idDevice);
  };

  const stopTraceNetwork = (idDevice) => {
    device_detail.stopTraceNetwork(idDevice);
  };

  const setThongTinDevice = (record) => {
    device_detail.setthongTinThietBi(record);
  };

  const changeTypeLayout = (value) => {
    setTypeLayout(value);
  };

  const renderLast = (el) => {
    return (
      // <Popover
      //   content={
      <div className={styles.renderLast}>
        {el.agentInstalled ? (<>
          {el.tracing_network ? (
            <Button
              // block
              type="primary"
              shape="circle"
              size="large"
              icon={<PauseCircleOutlined />}
              title="Dừng theo dõi luồng mạng"
              onClick={() => stopTraceNetwork(el.id)}
            />
          ) : (
            <Button
              icon={<PlayCircleOutlined />}
              shape="circle"
              size="large"
              style={{
                background: '#1890ff',
                color: 'white',
              }}
              title="Theo dõi luồng mạng"
              onClick={() => traceNetwork(el.id)}
            />
          )}
          <Divider type="vertical" />
        </>) : (<></>)}
        {el.agentInstalled ? (
          <Button
            // block
            type="primary"
            shape="circle"
            size="large"
            icon={<CloseCircleOutlined />}
            title="Gỡ tác tử"
            onClick={() => onUninstallDevice(el.id)}
          />
        ) : (
          <Button
            icon={<PlusOutlined />}
            shape="circle"
            size="large"
            style={{
              background: '#1890ff',
              color: 'white',
            }}
            title="Cài tác tử"
            onClick={() => onInstallDevice(el)}
          />
        )}
        <Divider type="vertical" />
        <Button
          type="primary"
          shape="circle"
          size="large"
          style={{
            backgroundColor: 'white',
            color: 'black',
          }}
          title="Chỉnh sửa thiết bị"
          icon={<EditOutlined />}
          onClick={() => showModalChinhSua(el)}
        />
        <Divider type="vertical" />
        <Popconfirm
          title="Bạn có muốn khởi động lại thiết bị"
          okText="Có"
          cancelText="Không"
          onConfirm={() => onReloadDevice(el)}
        >
          <Button
            shape="circle"
            size="large"
            icon={<ReloadOutlined />}
            title="Khởi động lại thiết bị"
          ></Button>
        </Popconfirm>
        <Divider type="vertical" />
        <Popconfirm
          title="Bạn có muốn cách ly thiết bị?"
          okText="Có"
          cancelText="Không"
          onConfirm={() => onIsolateDevice(el)}
        >
          <Button
            shape="circle"
            size="large"
            icon={<StopOutlined />}
            title="Cách ly thiết bị khỏi tất cả mạng"
          ></Button>
        </Popconfirm>
        <Divider type="vertical" />
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa thiết bị"
          okText="Có"
          cancelText="Không"
          onConfirm={() => onDeleteDevice(el)}
        >
          <Button shape="circle" size="large" icon={<DeleteOutlined />}></Button>
        </Popconfirm>
      </div>
      // }
      // title="Thao tác"
      // >
      //  <SettingOutlined />
      // </Popover>
    );
  };

  const installListKey = () => {
    if (selectedRowKeys?.length <= 0) {
      notificationAlert('error', 'Vui lòng chọn thiết bị');
      return;
    }
    devices.installListDevices(selectedRowKeys.map((item) => item.id));
  };

  const unInstallListKey = () => {
    if (selectedRowKeys?.length <= 0) {
      notificationAlert('error', 'Vui lòng chọn thiết bị');
      return;
    }
    devices.unInstallListDevices(selectedRowKeys.map((item) => item.id));
  };

  const blackListIP = () => {
    if (selectedRowKeys?.length <= 0) {
      notificationAlert('error', 'Vui lòng chọn thiết bị');
      return;
    }
    setListDevicesBlackList(selectedRowKeys.map((item) => item.id));
  };

  const whiteListIP = () => {
    if (selectedRowKeys?.length <= 0) {
      notificationAlert('error', 'Vui lòng chọn thiết bị');
      return;
    }
    setListDevicesWhiteList(selectedRowKeys.map((item) => item.id));
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKeys.map((item) => item.key),
    onChange: (selected: React.Key[], selectedRows: DataType[]) => {
      // let tmp = selectedRowKeys;
      // selectedRows.map(item => {
      //   let flag = true;
      //   selectedRowKeys.map(e => {
      //     if (e.id === item?.id) {
      //       flag = false;
      //     }
      //   })
      //   if (flag) {
      //     tmp = tmp.concat(item);
      //   }
      // })
      // setSelectedRowKeys(tmp);
      setSelectedRowKeys(selectedRows);
    },
  };

  const setListKey = async () => {
    setHasSelectKey(true);
    setSelectedRowKeys([]);
  };

  const setListKeyIP = async () => {
    setSelectedRowKeys([]);
    setHasSelectKeyIP(true);
  };

  console.log(listDevicesWhiteList, 'listDevicesWhiteList');

  const handleFinish = (values) => {
    console.log(values);
    devices.setFilter(values);

    devices.getData({ ...values });
  };

  return (
    <>
      <PageContainer
        title={
          <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
            <b style={{ marginRight: 15 }}>Quản trị thiết bị</b>
            <div style={{ fontSize: 20 }}>
              <Tooltip title="Dạng bảng">
                {typeLayout ? (
                  <DatabaseOutlined onClick={() => changeTypeLayout(!typeLayout)} />
                ) : (
                  <DatabaseTwoTone onClick={() => changeTypeLayout(!typeLayout)} />
                )}
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="Dạng ô">
                {!typeLayout ? (
                  <AppstoreOutlined onClick={() => changeTypeLayout(!typeLayout)} />
                ) : (
                  <AppstoreTwoTone onClick={() => changeTypeLayout(!typeLayout)} />
                )}
              </Tooltip>
            </div>
          </div>
        }
      >
        <Card>
          <Form
            layout="vertical"
            form={form}
            initialValues={devices.filter}
            // onFinish={values => {
            //   alerts.setFilter(values);
            //   actionRef?.current?.reloadAndRest();
            // }}
            onFinish={handleFinish}
          >
            <Row gutter={[20, 20]}>
              <Col span={8}>
                <Form.Item label="Loại thiết bị" name="device_type">
                  <Select defaultValue={devices.filter?.type ?? ''}>
                    <Select.Option value="">Tất cả loại thiết bị</Select.Option>
                    {[
                      {
                        value: 'router',
                        label: 'Router',
                      },
                      {
                        value: 'ip_cam',
                        label: 'IP Cam',
                      },
                      {
                        value: 'smartbox',
                        label: 'Smartbox',
                      },
                      {
                        value: 'gateway',
                        label: 'Gateway',
                      },
                      {
                        value: 'hardware',
                        label: 'Hardware',
                      },
                    ].map((item) => (
                      <Select.Option value={item.value}>{item.label}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Giao thức" name="protocol">
                  <Select defaultValue={''}>
                    <Select.Option value="">Tất cả</Select.Option>
                    {[
                      {
                        value: 'ssh',
                        label: 'Ssh',
                      },
                      {
                        value: 'telnet',
                        label: 'Telnet',
                      },
                    ].map((item, idx) => (
                      <Select.Option key={idx + 1} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Trạng thái cài đặt" name="agentInstalled">
                  <Select defaultValue={devices.filter?.agentInstalled ?? ''}>
                    <Select.Option value="">Tất cả trạng thái</Select.Option>
                    {[
                      {
                        value: 'true',
                        label: 'Đã cài đặt',
                      },
                      {
                        value: 'false',
                        label: 'Chưa cài đặt',
                      },
                    ].map((item, idx) => (
                      <Select.Option key={idx + 1} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Tên thiết bị" name="name">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Ip" name="ip">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Địa chỉ MAC" name="mac_addr">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Button type="primary" htmlType="submit">
              Tìm kiếm
            </Button>
          </Form>
        </Card>
        <Spin spinning={!!devices?.loading ?? false} tip="Loading...">
          <div style={{ margin: '20px 0' }}>
            <Button
              type="primary"
              onClick={showModalThemMoi}
              icon={<PlusOutlined />}
              style={{ marginRight: 15 }}
            >
              Thêm mới
            </Button>
            {/* {!hasSelectKey && !hasSelectKeyIP && !typeLayout && (
              <Button
                type="primary"
                onClick={() => setListKey()}
                icon={<SaveOutlined />}
                style={{ marginRight: 15 }}
              >
                Lựa chọn danh sách cài đặt/gỡ tắc tử
              </Button>
            )}
            {!hasSelectKeyIP && !hasSelectKey && !typeLayout && (
              <Button
                type="primary"
                onClick={() => setListKeyIP()}
                icon={<SaveOutlined />}
                style={{ marginRight: 15 }}
              >
                Lựa chọn danh sách kiểm soát IP
              </Button>
            )}
            {hasSelectKey && !typeLayout && (
              <>
                <Button
                  type="primary"
                  onClick={() => installListKey()}
                  icon={<SaveOutlined />}
                  style={{ marginRight: 15 }}
                >
                  Cài đặt tác tử cho danh sách đã chọn
                </Button>
                <Button
                  type="primary"
                  onClick={() => unInstallListKey()}
                  icon={<SaveOutlined />}
                  style={{ marginRight: 15 }}
                >
                  Gỡ tác tử cho danh sách đã chọn
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setHasSelectKey(false);
                    setSelectedRowKeys([]);
                  }}
                  icon={<SaveOutlined />}
                  style={{ marginRight: 15 }}
                >
                  Thoát
                </Button>
              </>
            )} */}
            {hasSelectKeyIP && !typeLayout && (
              <>
                <Button
                  type="primary"
                  onClick={() => whiteListIP()}
                  icon={<SaveOutlined />}
                  style={{ marginRight: 15 }}
                >
                  Thêm White List IP vào danh sách thiết bị
                </Button>
                <Button
                  type="primary"
                  onClick={() => blackListIP()}
                  icon={<SaveOutlined />}
                  style={{ marginRight: 15 }}
                >
                  Thêm Black List IP vào danh sách thiết bị
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setHasSelectKeyIP(false);
                    setSelectedRowKeys([]);
                  }}
                  icon={<SaveOutlined />}
                  style={{ marginRight: 15 }}
                >
                  Thoát
                </Button>
              </>
            )}
          </div>

          {typeLayout && (
            <Row gutter={[24, 16]} justify="center">
              {devices.data.map((el: any) => (
                <Col
                  xxl={{ span: 6 }}
                  xl={{ span: 8 }}
                  lg={{ span: 12 }}
                  md={{ span: 12 }}
                  sm={{ span: 22 }}
                  key={el.id}
                >
                  <Popconfirm
                    title="Bạn có chắc chắn muốn xóa thiết bị"
                    okText="Có"
                    cancelText="Không"
                    onConfirm={() => onDeleteDevice(el)}
                  >
                    <Button
                      style={{ position: 'absolute', top: '-14px', right: '-7px', zIndex: 4 }}
                      shape="circle"
                      size="large"
                      icon={<DeleteOutlined />}
                    ></Button>
                  </Popconfirm>
                  <Popconfirm
                    title="Bạn có muốn khởi động lại thiết bị"
                    okText="Có"
                    cancelText="Không"
                    onConfirm={() => onReloadDevice(el)}
                  >
                    <Button
                      style={{
                        position: 'absolute',
                        top: '30px',
                        right: '-7px',
                        zIndex: 4,
                        color: 'white',
                        backgroundColor: '#1890ff',
                      }}
                      shape="circle"
                      size="large"
                      icon={<ReloadOutlined />}
                      title="Khởi động lại thiết bị"
                    ></Button>
                  </Popconfirm>
                  <Card
                    hoverable
                    style={{
                      overflow: 'hidden',
                      borderRadius: '10px',
                      boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                    }}
                    cover={
                      <div
                        onClick={() => {
                          history.push(`/device/${el?.id ?? ''}`);
                          setThongTinDevice(el);
                        }}
                        style={{
                          width: '100%',
                          height: 300,
                          border: '1px solid rgba(1,1,1,0.1)',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <img alt="example" src={DefaultDeviceImg} style={{ height: '70%' }} />
                      </div>
                    }
                    actions={[
                      <>
                        <Row gutter={[8, 8]} justify="center" align="middle">
                          {el.agentInstalled ? (
                            <Col xxl={11} sm={23}>
                              <Button
                                // block
                                type="primary"
                                icon={<DeleteOutlined />}
                                onClick={() => onUninstallDevice(el.id)}
                                style={{
                                  width: '100%',
                                }}
                              >
                                Gỡ tác tử
                              </Button>
                            </Col>
                          ) : (
                            <Col xxl={11} sm={23}>
                              <Button
                                block
                                icon={<PlusOutlined />}
                                style={{
                                  background: '#1890ff',
                                  color: 'white',
                                  width: '100%',
                                }}
                                onClick={() => onInstallDevice(el)}
                              >
                                Cài tác tử
                              </Button>
                            </Col>
                          )}
                          <Col xxl={11} sm={23}>
                            <Button
                              block
                              type="primary"
                              style={{
                                backgroundColor: 'white',
                                color: 'black',
                                width: '100%',
                              }}
                              icon={<EditOutlined />}
                              onClick={() => showModalChinhSua(el)}
                            >
                              Sửa thông tin
                            </Button>
                          </Col>
                        </Row>
                        ,
                      </>,
                    ]}
                  >
                    <Meta
                      onClick={() => {
                        history.push(`/device/${el?.id ?? ''}`);
                      }}
                      title={`Thiết bị: ${el.name}`}
                      description={
                        <div>
                          <div>
                            <b>Username:</b> {el.username}
                          </div>
                          <div>
                            <b>IP:</b> {`${el.ip}:${el.port}`}
                            <Divider type="vertical" style={{ width: '3px' }} />
                            <b>Protocol:</b> {el.protocol}
                          </div>
                          <div>
                            <b>Trạng thái: </b>
                            <Tag color={el.agentInstalled ? '#87d068' : '#f50'}>
                              {el.agentInstalled ? 'Đang giám sát' : 'Chưa giám sát'}
                            </Tag>
                          </div>
                          <div>
                            <b>Theo dõi SystemCall: </b>
                            <Tag color={el.tracing_syscall !== '' ? '#87d068' : '#f50'}>
                              {el.tracing_syscall !== ''
                                ? `Đang theo dõi với pid: ${el?.tracing_syscall ?? ''}`
                                : 'Chưa theo dõi'}
                            </Tag>
                          </div>
                          <div>
                            <b>Địa chỉ Mac: </b>
                            <Tag color="#87d068">{el.mac_addr}</Tag>
                          </div>
                          <div>
                            <b>Theo dõi luồng mạng: </b>
                            <Tag color="#f50">
                              {!el.tracing_network ? 'Chưa theo dõi' : 'Đang theo dõi'}
                            </Tag>
                          </div>
                          <div>
                            <b>Loại thiết bị: </b>
                            <Tag color="#87d068">
                              {el.hwagent ? 'Hardware Agent' : 'Software Agent'}
                            </Tag>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
          {!typeLayout && (
            <Card>
              <Table
                className={styles.table}
                {...((hasSelectKey || hasSelectKeyIP) && {
                  rowSelection: {
                    type: 'checkbox',
                    ...rowSelection,
                  },
                })}
                // onRow={(record, rowIndex) => {
                //   return {
                //     onClick: (event) => {
                //       // console.log(record);
                //       history.push(`/device/${record?.id ?? ''}`);
                //       setThongTinDevice(record);
                //     },
                //   };
                // }}
                // rowSelection={{
                //   type: 'checkbox',
                //   ...rowSelection,
                // }}

                columns={[
                  {
                    title: 'STT',
                    dataIndex: 'index',
                    width: 80,
                    align: 'center',
                    onCell: (record, rowIndex) => {
                      return {
                        onClick: (event) => {
                          // console.log(record);
                          history.push(`/device/${record?.id ?? ''}`);
                          setThongTinDevice(record);
                        },
                      };
                    },
                  },
                  {
                    title: 'Tên thiết bị',
                    dataIndex: 'name',
                    width: 120,
                    align: 'center',
                    onCell: (record, rowIndex) => {
                      return {
                        onClick: (event) => {
                          // console.log(record);
                          history.push(`/device/${record?.id ?? ''}`);
                          setThongTinDevice(record);
                        },
                      };
                    },
                  },
                  {
                    title: 'Hình ảnh',
                    dataIndex: 'avatar',
                    width: 160,
                    align: 'center',
                    render: (val, record) => (
                      <img
                        alt="example"
                        src={record.avatar ? record.avatar : DefaultDeviceImg}
                        style={{ width: 100, height: 100, objectFit: 'cover' }}
                      />
                    ),
                    onCell: (record, rowIndex) => {
                      return {
                        onClick: (event) => {
                          // console.log(record);
                          history.push(`/device/${record?.id ?? ''}`);
                          setThongTinDevice(record);
                        },
                      };
                    },
                  },
                  {
                    title: 'Username',
                    dataIndex: 'username',
                    width: 120,
                    align: 'center',
                    onCell: (record, rowIndex) => {
                      return {
                        onClick: (event) => {
                          // console.log(record);
                          history.push(`/device/${record?.id ?? ''}`);
                          setThongTinDevice(record);
                        },
                      };
                    },
                  },
                  {
                    title: 'IP',
                    dataIndex: 'ip',
                    width: 150,
                    align: 'center',
                    render: (val, record) => `${val}:${record?.port}`,
                    onCell: (record, rowIndex) => {
                      return {
                        onClick: (event) => {
                          // console.log(record);
                          history.push(`/device/${record?.id ?? ''}`);
                          setThongTinDevice(record);
                        },
                      };
                    },
                  },
                  {
                    title: 'Protocol',
                    dataIndex: 'protocol',
                    width: 100,
                    align: 'center',
                    onCell: (record, rowIndex) => {
                      return {
                        onClick: (event) => {
                          // console.log(record);
                          history.push(`/device/${record?.id ?? ''}`);
                          setThongTinDevice(record);
                        },
                      };
                    },
                  },
                  {
                    title: 'Trạng thái',
                    dataIndex: 'agentInstalled',
                    width: 100,
                    align: 'center',
                    render: (agentInstalled) => (
                      <Tag color={agentInstalled ? '#87d068' : '#f50'}>
                        {agentInstalled ? 'Đang giám sát' : 'Chưa giám sát'}
                      </Tag>
                    ),
                    onCell: (record, rowIndex) => {
                      return {
                        onClick: (event) => {
                          // console.log(record);
                          history.push(`/device/${record?.id ?? ''}`);
                          setThongTinDevice(record);
                        },
                      };
                    },
                  },
                  {
                    title: 'Theo dõi Systemcall',
                    dataIndex: 'tracing_syscall',
                    width: 100,
                    align: 'center',
                    render: (tracing_syscall) => (
                      <Tag color={tracing_syscall !== '' ? '#87d068' : '#f50'}>
                        {tracing_syscall !== ''
                          ? `Đang theo dõi với pid: ${tracing_syscall ?? ''}`
                          : 'Chưa theo dõi'}
                      </Tag>
                    ),
                    onCell: (record, rowIndex) => {
                      return {
                        onClick: (event) => {
                          // console.log(record);
                          history.push(`/device/${record?.id ?? ''}`);
                          setThongTinDevice(record);
                        },
                      };
                    },
                  },
                  {
                    title: 'Địa chỉ MAC',
                    dataIndex: 'mac_addr',
                    width: 150,
                    align: 'center',
                    onCell: (record, rowIndex) => {
                      return {
                        onClick: (event) => {
                          // console.log(record);
                          history.push(`/device/${record?.id ?? ''}`);
                          setThongTinDevice(record);
                        },
                      };
                    },
                  },
                  {
                    title: 'Thao tác',
                    width: 311,
                    fixed: 'right',
                    align: 'center',
                    render: (_, record) => renderLast(record),
                  },
                ]}
                // request={async (params = {}) => {
                //   console.log(`params`, params);
                //   devices.setPayloadModel(params);
                //   const response = await devices
                //     .getData({
                //       ...params,
                //       data: {
                //         device_type:
                //           devices?.filter?.type === '*'
                //             ? ['router', 'ip_cam', 'smartbox', 'gateway', 'hardware']
                //             : [devices?.filter?.type],
                //       },
                //       page: params?.current ?? 1,
                //       page_size: params?.pageSize ?? 10,
                //     })
                //     .then((res: any) => console.log(res));
                //   console.log(response, 'dataa');
                //   return {
                //     data: data?.map((item, index) => ({
                //       ...item,
                //       index: index + 1,
                //     })),
                //     success: true,
                //     total,
                //   };
                // }}
                dataSource={dataSource}
                pagination={{
                  pageSize: 10,
                }}
                scroll={{ x: 1600 }}
              />
            </Card>
          )}
        </Spin>
      </PageContainer>

      {/* Modal thêm black/white list */}
      <Modal
        visible={listDevicesWhiteList?.length > 0 || listDevicesBlackList?.length > 0}
        width={1000}
        onCancel={() => {
          setListDevicesBlackList([]);
          setListDevicesWhiteList([]);
          setListIP([]);
        }}
        footer={[]}
      >
        {listDevicesWhiteList?.length > 0 && (
          <WhiteListIp
            listIP={listIP}
            selectedRowKeys={(data) => {
              setListIP(data);
            }}
            moreButton={[
              <Button
                type="primary"
                onClick={async () => {
                  addListIPToDevices(
                    {
                      id: listDevicesWhiteList,
                      whitelistip: listIP,
                    },
                    'white',
                    () => {
                      notificationAlert('success', 'Thêm mới thành công');
                      setListDevicesWhiteList([]);
                      setListIP([]);
                    },
                  );
                }}
              >
                Thêm danh sách IP cho phép vào thiết bị
              </Button>,
            ]}
          />
        )}
        {listDevicesBlackList?.length > 0 && (
          <BlackListIp
            listIP={listIP}
            selectedRowKeys={(data) => {
              setListIP(data);
            }}
            moreButton={[
              <Button
                type="primary"
                onClick={async () => {
                  addListIPToDevices(
                    {
                      id: listDevicesBlackList,
                      blacklistip: listIP,
                    },
                    'black',
                    () => {
                      notificationAlert('success', 'Thêm mới thành công');
                      setListDevicesBlackList([]);
                      setListIP([]);
                    },
                  );
                }}
              >
                Thêm danh sách IP bị chặn vào thiết bị
              </Button>,
            ]}
          />
        )}
      </Modal>

      {/* Modal Chỉnh sửa */}
      <Modal
        title={`Chỉnh sửa thông tin thiết bị ${clickedCard?.name}`}
        visible={isModalChinhSuaVisible}
        onOk={handleChinhSuaOk}
        onCancel={handleChinhSuaCancel}
        width={600}
        key={clickedCard?.id}
      >
        <Form
          id="formChinhSua"
          {...formItemLayout}
          form={chinhSuaForm}
          name="control-hooks"
          onFinish={(values) => onChinhSuaFormFinish(clickedCard?.id, values)}
        >
          <Form.Item label="Tên thiết bị" name="name">
            <Input placeholder="Tên thiết bị" />
          </Form.Item>
          <Form.Item label="Loại thiết bị" name="device_type">
            <Select>
              <Select.Option value="">Tất cả loại thiết bị</Select.Option>
              <Select.Option value="router">Router</Select.Option>
              <Select.Option value="ip_cam">IP Cam</Select.Option>
              <Select.Option value="smartbox">Smartbox</Select.Option>
              <Select.Option value="gateway">Gateway</Select.Option>
              <Select.Option value="hardware">Hardware</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Hình ảnh">
            <Input placeholder="Hình ảnh" type="file" name="avatar" />
          </Form.Item>
          <Form.Item label="Protocol" name="protocol">
            <Radio.Group>
              <Radio value={'telnet'}>telnet</Radio>
              <Radio value={'ssh'}>ssh</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Địa chỉ IP" name="ip">
            <Input placeholder="Địa chỉ IP" />
          </Form.Item>

          <Form.Item label="IP Public" name="from_internet" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="Cổng/Port" name="port">
            <InputNumber min={1} max={9999} />
          </Form.Item>

          <Form.Item label="Remote Cổng/Port" name="remote_port">
            <InputNumber min={1} max={9999} />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true }]}
          // initialValue={clickedCard?.address}
          >
            <Input placeholder="Địa chỉ" />
          </Form.Item>
          <Form.Item label="Tự động cập nhập mật khẩu" colon={false} name="autoUpdatePasswd">
            <Radio.Group
              value={autoUpdatePasswd}
              onChange={(e) => {
                setAutoUpdatePassword(e.target.value);
              }}
              defaultValue={clickedCard?.autoUpdatePasswd}
            >
              <Radio value={true}>Có</Radio>
              <Radio value={false}>Không</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Địa chỉ MAC" name="mac_addr">
            <Input placeholder="Địa chỉ MAC" />
          </Form.Item>
          <Form.Item label=" " colon={false} name="hwagentOrOs">
            <Radio.Group
              value={hwagentOrOs}
              onChange={(e) => {
                setHwagentOrOs(e.target.value);
              }}
            >
              <Radio value={true}>Hardware Agent</Radio>
              <Radio value={false}>Os</Radio>
            </Radio.Group>
          </Form.Item>
          {hwagentOrOs && (
            <Form.Item label="Hardware Agent" name="hwagent">
              <Radio.Group>
                <Radio value={true}>Có</Radio>
                <Radio value={false}>Không</Radio>
              </Radio.Group>
            </Form.Item>
          )}
          {!hwagentOrOs && (
            <Form.Item label="OS" name="os">
              <Select>
                <Select.Option value="linux">Linux</Select.Option>
                <Select.Option value="windows">Window</Select.Option>
              </Select>
            </Form.Item>
          )}
          <Form.Item
            label="Agent name"
            name="agent_name"
            // rules={[{ required: true }]}
            initialValue=""
          >
            <Select>
              <Select.Option value="">Tự động</Select.Option>
              <Select.Option value="aarch64-g">aarch64-g</Select.Option>
              <Select.Option value="agent-mips64el-g-ha">agent-mips64el-g-ha</Select.Option>
              <Select.Option value="armv5tel-g">armv5tel-g</Select.Option>
              <Select.Option value="armv7l-g">armv7l-g</Select.Option>
              <Select.Option value="armv7l-u">armv7l-u</Select.Option>
              <Select.Option value="mips-u">mips-u</Select.Option>
              <Select.Option value="mips-u-old">mips-u-old</Select.Option>
              <Select.Option value="mips-u.1">mips-u.1</Select.Option>
              <Select.Option value="mips64-g">mips64-g</Select.Option>
              <Select.Option value="mips64-u">mips64-u</Select.Option>
              <Select.Option value="mips64el-u">mips64el-u</Select.Option>
              <Select.Option value="mipsel-u">mipsel-u</Select.Option>
              <Select.Option value="mipsel-u-cam">mipsel-u-cam</Select.Option>
              <Select.Option value="powerpc-u">powerpc-u</Select.Option>
              <Select.Option value="sparc-u">sparc-u</Select.Option>
              <Select.Option value="x86_64-g">x86_64-g</Select.Option>
              <Select.Option value="agent_windows">agent_windows</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Username" name="username">
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input.Password placeholder="Password" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Thêm mới */}
      <Modal
        title="Thêm mới thiết bị"
        visible={isModalThemMoiVisible}
        onOk={handleThemMoiOk}
        onCancel={handleThemMoiCancel}
        width={600}
      >
        <Form
          id="themMoiForm"
          {...formItemLayout}
          form={themMoiForm}
          name="control-hooks"
          onFinish={onThemMoiFormFinish}
        >
          <Form.Item label="Tên thiết bị" name="name" rules={[{ required: true }]} initialValue="">
            <Input placeholder="Tên thiết bị" />
          </Form.Item>
          <Form.Item label="Loại thiết bị" name="device_type">
            <Select>
              {[
                {
                  value: 'router',
                  label: 'Router',
                },
                {
                  value: 'ip_cam',
                  label: 'IP Cam',
                },
                {
                  value: 'smartbox',
                  label: 'Smartbox',
                },
                {
                  value: 'gateway',
                  label: 'Gateway',
                },
                {
                  value: 'hardware',
                  label: 'Hardware',
                },
              ].map((item, idx) => (
                <Select.Option key={idx + 1} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Hình ảnh">
            <Input placeholder="Hình ảnh" type="file" name="avatar" />
          </Form.Item>
          <Form.Item label="Protocol" name="protocol" rules={[{ required: true }]} initialValue="">
            <Radio.Group>
              <Radio value={'telnet'}>telnet</Radio>
              <Radio value={'ssh'}>ssh</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Địa chỉ IP" name="ip" rules={[{ required: true }]} initialValue="">
            <Input placeholder="Địa chỉ IP" />
          </Form.Item>

          <Form.Item
            label="IP Public"
            name="from_internet"
            rules={[{ required: true }]}
            initialValue={false}
          >
            <Switch />
          </Form.Item>

          <Form.Item label="Cổng/Port" name="port" rules={[{ required: true }]} initialValue={22}>
            <InputNumber min={1} max={9999} />
          </Form.Item>

          <Form.Item
            label="Remote Cổng/Port"
            name="remote_port"
            rules={[{ required: true }]}
            initialValue={3333}
          >
            <InputNumber min={1} max={9999} />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true }]}
            initialValue=""
          >
            <Input placeholder="Địa chỉ" />
          </Form.Item>
          <Form.Item label="Tự động cập nhập mật khẩu" colon={false} name="autoUpdatePasswd">
            <Radio.Group
              value={autoUpdatePasswd}
              onChange={(e) => {
                setAutoUpdatePassword(e.target.value);
              }}
              defaultValue={false}
            >
              <Radio value={true}>Có</Radio>
              <Radio value={false}>Không</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Địa chỉ MAC"
            name="mac_addr"
            rules={[{ required: true }]}
            initialValue=""
          >
            <Input placeholder="Địa chỉ MAC" />
          </Form.Item>
          <Form.Item label=" " colon={false} name="hwagentOrOs">
            <Radio.Group
              value={hwagentOrOs}
              onChange={(e) => {
                setHwagentOrOs(e.target.value);
              }}
            >
              <Radio value={true}>Hardware Agent</Radio>
              <Radio value={false}>Os</Radio>
            </Radio.Group>
          </Form.Item>
          {hwagentOrOs && (
            <Form.Item label="Hardware Agent" name="hwagent" rules={[{ required: true }]}>
              <Radio.Group>
                <Radio value={true}>Có</Radio>
                <Radio value={false}>Không</Radio>
              </Radio.Group>
            </Form.Item>
          )}
          {!hwagentOrOs && (
            <Form.Item label="OS" name="os" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="linux">Linux</Select.Option>
                <Select.Option value="windows">Window</Select.Option>
              </Select>
            </Form.Item>
          )}
          <Form.Item
            label="Agent name"
            name="agent_name"
            // rules={[{ required: true }]}
            initialValue=""
          >
            <Select>
              <Select.Option value="">Tự động</Select.Option>
              <Select.Option value="aarch64-g">aarch64-g</Select.Option>
              <Select.Option value="agent-mips64el-g-ha">agent-mips64el-g-ha</Select.Option>
              <Select.Option value="armv5tel-g">armv5tel-g</Select.Option>
              <Select.Option value="armv7l-g">armv7l-g</Select.Option>
              <Select.Option value="armv7l-u">armv7l-u</Select.Option>
              <Select.Option value="mips-u">mips-u</Select.Option>
              <Select.Option value="mips-u-old">mips-u-old</Select.Option>
              <Select.Option value="mips-u.1">mips-u.1</Select.Option>
              <Select.Option value="mips64-g">mips64-g</Select.Option>
              <Select.Option value="mips64-u">mips64-u</Select.Option>
              <Select.Option value="mips64el-u">mips64el-u</Select.Option>
              <Select.Option value="mipsel-u">mipsel-u</Select.Option>
              <Select.Option value="powerpc-u">powerpc-u</Select.Option>
              <Select.Option value="sparc-u">sparc-u</Select.Option>
              <Select.Option value="x86_64-g">x86_64-g</Select.Option>
              <Select.Option value="agent_windows">agent_windows</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Username" name="username" rules={[{ required: true }]} initialValue="">
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true }]} initialValue="">
            <Input.Password placeholder="Password" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Devices;
