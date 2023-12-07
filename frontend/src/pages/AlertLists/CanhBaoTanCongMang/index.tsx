/* eslint-disable @typescript-eslint/ban-types */
import { useModel } from 'umi';
import { getAlerts } from '@/services/alerts';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { IntlProvider } from '@ant-design/pro-table';
import React, { useEffect } from 'react';
import './style.less';
import viVNIntl from 'antd/lib/locale/vi_VN';
import moment from 'moment';
import {
  ConfigProvider,
  Button,
  Form,
  Popconfirm,
  Row,
  Col,
  Select,
  Input,
  DatePicker,
} from 'antd';
import { DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import { ip } from '@/services/ip';
import rules from '@/utils/rules';
import { Excel } from 'antd-table-saveas-excel';

const { RangePicker } = DatePicker;

const CanhBaoTanCongMang: React.FC<{}> = () => {
  const {
    loading,
    data,
    getDataDashboard,
    total,
    deleteData,
    setPayloadModel,
    getExportDataExcel,
    getExportDataPDF,
    actionRef,
    excelFile,
    setExcelFile,
  } = useModel('alerts');
  const alerts = useModel('alerts');
  const devices = useModel('devices');
  const [form] = Form.useForm();
  useEffect(() => {
    devices.getData();
  }, []);

  console.log(devices.data);

  const renderLast = (value, record) => (
    <React.Fragment>
      <Popconfirm
        title="Bạn có chắc muốn xóa?"
        onConfirm={() => {
          deleteData(record?.id);
        }}
      >
        <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} title="Xóa" />
      </Popconfirm>
    </React.Fragment>
  );

  const handleFinish = (values) => {
    console.log(values);
    alerts.setFilter(values);
    actionRef.current?.reload();
  };

  const columns = [
    {
      dataIndex: 'index',
      title: 'STT',
      width: 80,
      hideInSearch: true,
    },
    {
      title: 'Mã thiết bị',
      dataIndex: 'device',
      width: 100,
      renderText: (val) => devices.data?.filter((item) => item.id === val)?.[0]?.name,
    },
    {
      title: 'Địa chỉ Ip',
      dataIndex: 'ip',
      width: 200,
    },
    {
      title: 'tin nhắn',
      dataIndex: 'message',
      width: 300,
      labelWidth: 100,
    },
    {
      title: 'Hash',
      dataIndex: 'hash',
      key: 'hash',
      width: 150,
      align: 'center',
    },

    {
      title: 'PID',
      dataIndex: 'pid',
      key: 'pid',
      width: 100,
      align: 'center',
    },

    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      width: 200,
      align: 'center',
    },

    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      hideInSearch: true,
      key: 'timestamp',
      width: 120,
      align: 'center',
      render: (value: string) => moment(new Date(value)).format('DD/MM/YYYY HH:mm:ss'),
      sorter: (a, b) => moment(a.timestamp).isBefore(moment(b.timestamp)),
    },
    {
      title: 'Thao tác',
      dataIndex: 'abc',
      hideInSearch: true,
      key: 'abc',
      width: 180,
      fixed: 'right',
      align: 'center',
      render: (value, record) => renderLast(value, record),
    },
  ];
  return (
    <>
      <Form
        layout="vertical"
        form={form}
        initialValues={alerts.filter}
        // onFinish={values => {
        //   alerts.setFilter(values);
        //   actionRef?.current?.reloadAndRest();
        // }}
        onFinish={handleFinish}
      >
        <Row gutter={[20, 20]}>
          <Col span={8} style={{display:'none'}}>
            <Form.Item label="Trạng thái" name="status">
              <Select>
                <Select.Option value="*">Tất cả trạng thái</Select.Option>
                {[
                  {
                    value: 'DA_XU_LY',
                    label: 'Đã xử lý',
                  },
                  {
                    value: 'CHUA_XU_LY',
                    label: 'Chưa xử lý',
                  },
                ].map((item) => (
                  <Select.Option value={item.value}>{item.label}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} style={{display:'none'}}>
            <Form.Item label="Loại tin nhắn" name="type">
              <Select>
                <Select.Option value="*">Tất cả loại tin nhắn</Select.Option>
                {[
                  {
                    value: 'NETWORK',
                    label: 'Tấn công mạng',
                  },
                  {
                    value: 'MALWARE',
                    label: 'Mã độc',
                  },
                  {
                    value: 'SYSCALL',
                    label: 'Lời gọi hệ thống',
                  },
                  {
                    value: 'LOG',
                    label: 'LOGS',
                  },
                  {
                    value: 'IPS',
                    label: 'Snort',
                  },
                ].map((item) => (
                  <Select.Option value={item.value}>{item.label}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Nội dung tin nhắn" name="message">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Thời gian" name="timestamp">
              <RangePicker allowClear style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6} style={{display:'none'}}>
            <Form.Item label="Thiết bị" name="device">
              <Select>
                <Select.Option value="*">Tất cả thiết bị</Select.Option>
                {devices.data?.map((item) => (
                  <Select.Option value={item?.id}>{item?.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} style={{display:'none'}}>
            <Form.Item label="IP" name="ip" rules={[...rules.dinhDangIP]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={6} style={{display:'none'}}>
            <Form.Item label="Địa chỉ" name="address">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Button type="primary" htmlType="submit">
          Tìm kiếm
        </Button>
        <Button
          onClick={() => {
            alerts.setFilter(alerts.initFilter);
            form.setFieldsValue(alerts.initFilter);
            actionRef?.current?.reloadAndRest();
          }}
        >
          Đặt lại
        </Button>
        <div style={{ float: 'right' }}>
          <Button
            icon={<ExportOutlined />}
            style={{ marginBottom: 15 }}
            onClick={async () => {
              await getExportDataExcel({
                data: {
                  status:
                    alerts?.filter?.status === '*'
                      ? ['DA_XU_LY', 'CHUA_XU_LY']
                      : [alerts?.filter?.status],
                  type:
                    alerts?.filter?.type === '*'
                      ? ['NETWORK', 'MALWARE', 'SYSCALL', 'LOG', 'IPS']
                      : [alerts?.filter?.type],
                  timestamp:
                    alerts?.filter?.timestamp === undefined
                      ? [moment('1/1/1900').toISOString(), moment('1/1/3000').toISOString()]
                      : alerts?.filter?.timestamp,
                  device: alerts?.filter?.device === '*' ? [] : [alerts?.filter?.device],
                },
                ...(alerts?.filter?.message && { message: alerts?.filter?.message }),
                ...(alerts?.filter?.address && { address: alerts?.filter?.address }),
                ...(alerts?.filter?.ip && { ip: alerts?.filter?.ip }),
                all_device: alerts?.filter?.device === '*',
              });
            }}
          >
            Export XLSX
          </Button>
          <Button
            icon={<ExportOutlined />}
            style={{ marginBottom: 15 }}
            onClick={async () => {
              await getExportDataPDF({
                data: {
                  status:
                    alerts?.filter?.status === '*'
                      ? ['DA_XU_LY', 'CHUA_XU_LY']
                      : [alerts?.filter?.status],
                  type:
                    alerts?.filter?.type === '*'
                      ? ['NETWORK', 'MALWARE', 'SYSCALL', 'LOG', 'IPS']
                      : [alerts?.filter?.type],
                  timestamp:
                    alerts?.filter?.timestamp === undefined
                      ? [moment('1/1/1900').toISOString(), moment('1/1/3000').toISOString()]
                      : alerts?.filter?.timestamp,
                  device: alerts?.filter?.device === '*' ? [] : [alerts?.filter?.device],
                },
                ...(alerts?.filter?.message && { message: alerts?.filter?.message }),
                ...(alerts?.filter?.address && { address: alerts?.filter?.address }),
                ...(alerts?.filter?.ip && { ip: alerts?.filter?.ip }),
                all_device: alerts?.filter?.device === '*',
              });
            }}
          >
            Export PDF
          </Button>
        </div>
      </Form>
      <ConfigProvider locale={viVNIntl}>
        <ProTable
          columns={columns}
          actionRef={actionRef}
          search={false}
          pagination={{
            defaultPageSize: 10,
            total: total,
          }}
          // tableStyle={{ height: '500px' }}
          request={async (params = {}) => {
            console.log(`params`, params);
            setPayloadModel(params);
            const response = await getDataDashboard({
              ...params,
              data: {
                status:
                  alerts?.filter?.status === '*'
                    ? ['DA_XU_LY', 'CHUA_XU_LY']
                    : [alerts?.filter?.status],
                type:
                  alerts?.filter?.type === '*'
                    ? ['NETWORK', 'MALWARE', 'SYSCALL', 'LOG', 'IPS']
                    : [alerts?.filter?.type],
                timestamp:
                  alerts?.filter?.timestamp === undefined
                    ? [moment('1/1/1900').toISOString(), moment('1/1/3000').toISOString()]
                    : alerts?.filter?.timestamp,
                device: alerts?.filter?.device === '*' ? [] : [alerts?.filter?.device],
              },
              ...(alerts?.filter?.message && { message: alerts?.filter?.message }),
              ...(alerts?.filter?.address && { address: alerts?.filter?.address }),
              ...(alerts?.filter?.ip && { ip: alerts?.filter?.ip }),
              all_device: alerts?.filter?.device === '*',
              page: params?.current ?? 1,
              page_size: params?.pageSize ?? 10,
            }).then((res: any) => console.log(res));
            console.log(response, 'dataa');
            return {
              data: data?.map((item, index) => ({
                ...item,
                index: index + 1,
              })),
              success: true,
              total,
            };
          }}
          dataSource={(data || []).map((item, index) => ({
            ...item,
            index: index + 1,
          }))}
          rowKey="id"
        />
      </ConfigProvider>
    </>
  );
};

export default CanhBaoTanCongMang;
