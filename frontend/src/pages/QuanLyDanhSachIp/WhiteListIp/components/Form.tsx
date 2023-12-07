/* eslint-disable no-underscore-dangle */
import { Form, Input, Button, Card, Select, Spin, InputNumber, Col, Row, Tabs, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import moment from 'moment';
import { IWhiteListIpRecord } from '@/models/whitelistip';
import rules from '@/utils/rules';
import Service from '@/pages/QuanLyDanhSachIp/WhiteListIp/services';

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const FormBaiHat = () => {
  const [form] = Form.useForm();
  const whitelistip = useModel('whitelistip');
  const [dataDevice, setDataDevice] = useState<any[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [listWhiteDevice, setListWhiteDevice] = useState<any[]>([])
  const pathname = window.location.pathname;
  const arrPath = pathname.split('/');
  const handleGetData = async () => {
    const res = await Service.get({ page: 1, limit: 1000 });
    if (res && res?.results) {
      setDataDevice(res?.results)
    }

  }
  useEffect(() => {
    handleGetData()
  }, []);
  const handleFinish = async (values: IWhiteListIpRecord) => {
    if (whitelistip?.value?.edit) {
      const response = await whitelistip.dispatch.upd({
        ...(whitelistip?.value?.record ?? {}),
        ...values,
      });
    } else {
      const response = await whitelistip.dispatch.add2(values);
    }
  };
  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setListWhiteDevice(selectedRows)
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
    },
    {
      title: 'Ip',
      dataIndex: 'ip',
    },
    {
      title: 'Đường dẫn',
      dataIndex: 'url',
    },
  ];
  const handleAdd = async () => {
    const listId: string[] = [];
    const listWhitelistip: string[] = [];
    listWhiteDevice?.map((val: any) => {
      listId.push(arrPath?.[2]);
      listWhitelistip.push(val.id)
    })
    const res = await Service.addWhiteDevice({ id: listId, whitelistip: listWhitelistip })
    if (res) {
      message.success('Thêm thành công!')
      whitelistip.setShowDrawer(false)
      whitelistip.dispatch.get({ page: 1, limit: 10 })
    }
  }
  return (
    <Spin spinning={whitelistip.value.loading}>
      <Tabs defaultActiveKey="1">
        {(!whitelistip.value.edit && arrPath[1] == 'device') && <Tabs.TabPane tab="Thêm từ thiết bị có sẵn" key="1">
          <>
            <Table rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }} dataSource={dataDevice?.map((val: any, i: any) => { return { ...val, key: i + 1 } })} columns={columns} />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button type="primary" onClick={() => handleAdd()}>Thêm mới</Button>
            </div></>
        </Tabs.TabPane>}

        <Tabs.TabPane tab={whitelistip.value.edit ? 'Chỉnh sửa' : 'Thêm mới'} key={arrPath[1] == 'device' ? 2 : 1}>
          {/* <Card title={whitelistip.value.edit ? 'Chỉnh sửa' : 'Thêm mới'}> */}
          <Form
            {...layout}
            form={form}
            onFinish={handleFinish}
            initialValues={{
              ...(whitelistip?.value?.record ?? {}),
            }}
          >
            <Form.Item label="IP" name="ip" rules={[...rules.required, ...rules.dinhDangIP]}>
              <Input placeholder="IP..." />
            </Form.Item>
            <Form.Item label="Url" name="url">
              <Input placeholder="Url..." />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                {whitelistip.value?.edit ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Form.Item>
          </Form>
          {/* </Card> */}
        </Tabs.TabPane>

      </Tabs>

    </Spin>
  );
};

export default FormBaiHat;
