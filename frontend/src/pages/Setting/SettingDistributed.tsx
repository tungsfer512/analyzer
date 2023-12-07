import React, { useEffect } from 'react';
import {
  Button,
  Card,
  Checkbox,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  Select,
  Spin,
} from 'antd';
import { useModel } from 'umi';
import styles from './index.less';
import Title from 'antd/lib/typography/Title';
import Typography from 'antd/lib/typography/Typography';

const SettingAgent = () => {
  const setting_distributed = useModel('setting_distributed');
  const [visible, setVisible] = React.useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    setting_distributed.getData();
  }, []);

  const handleEdit = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onFinish = (values: any) => {
    console.log('Success:', values);
    setting_distributed.updateData(values).then(() => {
      setting_distributed.getData();
      setVisible(false);
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Card>
        <Title level={3}>Thiết lập phân tải</Title>
        <Button
          type="primary"
          htmlType="button"
          className={styles.itemFormButton}
          onClick={handleEdit}
        >
          Thiết lập thông số
        </Button>
        <Descriptions bordered column={1} style={{ marginTop: 16 }}>
          <Descriptions.Item label="Center Server">
            {setting_distributed.data.center_domain}
          </Descriptions.Item>
          <Descriptions.Item label="Center Server ID KEY">
            {setting_distributed.data.center_username}
          </Descriptions.Item>
          <Descriptions.Item label="Center Server SECRET KEY">
            {setting_distributed.data.center_password}
          </Descriptions.Item>
          <Descriptions.Item label="Ngưỡng phân tải CPU">
            {setting_distributed.data.cpu_threshold}
          </Descriptions.Item>
          <Descriptions.Item label="Ngưỡng phân tải RAM">
            {setting_distributed.data.ram_threshold}
          </Descriptions.Item>
          <Descriptions.Item label="Phân tải?">
            {setting_distributed.data.active ? 'Có' : 'Không'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Drawer title="Cập nhập thông số" width={720} onClose={onClose} open={visible}>
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={setting_distributed.data}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item label="Center Server" name="center_domain">
            <Input />
          </Form.Item>

          <Form.Item label="Center Server ID KEY" name="center_username">
            <Input />
          </Form.Item>

          <Form.Item label="Center Server SECRET KEY" name="center_password">
            <Input />
          </Form.Item>

          <Form.Item label="Ngưỡng phân tải CPU" name="cpu_threshold">
            <Input />
          </Form.Item>
          <Form.Item label="Ngưỡng phân tải RAM" name="ram_threshold">
            <Input />
          </Form.Item>
          <Form.Item label="Phân tải?" name="active">
            <Select>
              <Select.Option value={'true'}>Có</Select.Option>
              <Select.Option value={'false'}>Không</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={setting_distributed.loading[0]}>
              Cập nhập
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default SettingAgent;
