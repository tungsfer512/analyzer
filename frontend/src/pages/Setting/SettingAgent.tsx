import React, { useEffect } from 'react';
import { Button, Card, Checkbox, Divider, Drawer, Form, Input, Spin } from 'antd';
import { useModel } from 'umi';
import styles from './index.less';
import Title from 'antd/lib/typography/Title';
import Typography from 'antd/lib/typography/Typography';

const SettingAgent = () => {
  const setting = useModel('setting');
  const [visible, setVisible] = React.useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    setting.getAutoAgent();
  }, []);

  const handleEdit = () => {
    if (setting.timeAgent == -1) {
      form.setFieldsValue({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    }
    setVisible(true);
  };

  const handleUpdate = () => {
    setting.getAutoAgentClick();
  };

  const onClose = () => {
    setVisible(false);
  };

  const onFinish = (values: any) => {
    console.log('Success:', values);
    const { days, hours, minutes, seconds } = values;
    setting
      .updateAutoAgent(
        Number(days) * 24 * 60 * 60 +
          Number(hours) * 60 * 60 +
          Number(minutes) * 60 +
          Number(seconds),
      )
      .then(() => {
        setting.getAutoAgent();
        setting.getAutoAgent();
        setVisible(false);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const handleStopAgent = () => {
    setting.stopAgent().then(() => {
      setting.getAutoAgent();
      setting.getAutoAgent();
      setVisible(false);
    });
  };

  return (
    <>
      <Card>
        <Title level={3}>Cài đặt tự động cập nhập Agent</Title>
        <Typography className={styles.itemForm}>
          {' '}
          {setting.timeAgent !== -1 ? 'Đang chạy' : 'Đang tạm dừng'}
        </Typography>
        {setting.timeAgent !== -1 && (
          <Typography className={styles.itemForm}>
            {`
              Chu kỳ cập nhập:
              ${Math.floor(setting.timeAgent / 86400)} ngày
              ${Math.floor(
                (setting.timeAgent - Math.floor(setting.timeAgent / 86400) * 86400) / 3600,
              )} giờ
              ${Math.floor(
                (setting.timeAgent -
                  Math.floor(setting.timeAgent / 86400) * 86400 -
                  Math.floor(
                    (setting.timeAgent - Math.floor(setting.timeAgent / 86400) * 86400) / 3600,
                  ) *
                    3600) /
                  60,
              )} phút
              ${Math.floor(setting.timeAgent % 60)} giây
            `}
          </Typography>
        )}

        <Button
          type="primary"
          htmlType="button"
          className={styles.itemFormButton}
          onClick={handleEdit}
        >
          Đặt thời gian cập nhập
        </Button>

        {setting.timeAgent !== -1 && (
          <Button
            type="primary"
            style={{ marginLeft: '32px' }}
            htmlType="button"
            onClick={handleStopAgent}
            className={styles.itemFormButton}
            loading={setting.loading[0]}
          >
            Tạm dừng
          </Button>
        )}
        <Divider />
        <Button
          type="primary"
          htmlType="button"
          className={styles.itemFormButton}
          onClick={handleUpdate}
          loading={setting.loading[0]}
        >
          Cập nhập thủ công
        </Button>
      </Card>

      <Drawer title="Cập nhập" width={720} onClose={onClose} open={visible}>
        <Form
          name="basic"
          className={styles.formNmap}
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={setting.dataAutoAgent}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Ngày"
            name="days"
            rules={[{ required: false, message: 'Nhập số ngày!' }]}
            className={styles.itemForm}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giờ"
            name="hours"
            rules={[{ required: false, message: 'Nhập số giờ!' }]}
            className={styles.itemForm}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phút"
            name="minutes"
            rules={[{ required: false, message: 'Nhập số phút!' }]}
            className={styles.itemForm}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giây"
            name="seconds"
            rules={[{ required: false, message: 'Nhập số giây!' }]}
            className={styles.itemForm}
          >
            <Input />
          </Form.Item>

          <Form.Item className={styles.itemForm}>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.itemFormButton}
              loading={setting.loading[0]}
            >
              Cập nhập
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default SettingAgent;
