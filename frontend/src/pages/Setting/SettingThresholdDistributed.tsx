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
    setting_distributed.getThresholdDistributed();
  }, []);

  const handleEdit = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onFinish = (values: any) => {
    console.log('Success:', values);
    setting_distributed.updateThresholdDistributed(values).then(() => {
      setting_distributed.getThresholdDistributed();
      setVisible(false);
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Card>
        <Title level={3}>Thiết lập ngưỡng phân tải</Title>
        <Button
          type="primary"
          htmlType="button"
          className={styles.itemFormButton}
          onClick={handleEdit}
        >
          Đặt thông số
        </Button>
        <Descriptions bordered column={1} style={{ marginTop: 16 }}>
          <Descriptions.Item label="Ngưỡng độ trễ phân tải">
            {setting_distributed.threshold.latency_threshold}
          </Descriptions.Item>
          <Descriptions.Item label="Ngưỡng phân tải CPU">
            {setting_distributed.threshold.cpu_threshold}
          </Descriptions.Item>
          <Descriptions.Item label="Ngưỡng phân tải RAM">
            {setting_distributed.threshold.ram_threshold}
          </Descriptions.Item>
          <Descriptions.Item label="Có phân tải không">
            {setting_distributed.threshold.active_distributed ? 'Có' : 'Không'}
          </Descriptions.Item>
          <Descriptions.Item label="Có nhận phân tải không">
            {setting_distributed.threshold.active_distributed_receive ? 'Có' : 'Không'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Drawer title="Cập nhập" width={720} onClose={onClose} open={visible}>
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={setting_distributed.threshold}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item label="Ngưỡng độ trễ phân tải" name="latency_threshold">
            <Input />
          </Form.Item>

          <Form.Item label="Ngưỡng phân tải CPU" name="cpu_threshold">
            <Input />
          </Form.Item>
          <Form.Item label="Ngưỡng phân tải RAM" name="ram_threshold">
            <Input />
          </Form.Item>
          <Form.Item label="Có phân tải không" name="active_distributed">
            <Select>
              <Select.Option value={'true'}>Có</Select.Option>
              <Select.Option value={'false'}>Không</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Có nhận phân tải không" name="active_distributed_receive">
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
