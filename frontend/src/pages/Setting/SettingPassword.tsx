import React, { useEffect } from 'react';
import { Button, Card, Checkbox, Divider, Drawer, Form, Input, Spin } from 'antd';
import { useModel } from 'umi';
import styles from './index.less';
import Title from 'antd/lib/typography/Title';
import Typography from 'antd/lib/typography/Typography';

const SettingPassword = () => {
  const setting = useModel('setting');
  const [visible, setVisible] = React.useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    setting.getAutoPassword();
  }, []);

  const handleEdit = () => {
    if (setting.timePassword == -1) {
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
    setting.getAutoPasswordClick();
  };

  const onClose = () => {
    setVisible(false);
  };

  const onFinish = (values: any) => {
    console.log('Success:', values);
    const { days, hours, minutes, seconds } = values;
    setting
      .updateAutoPassword(
        Number(days) * 24 * 60 * 60 +
          Number(hours) * 60 * 60 +
          Number(minutes) * 60 +
          Number(seconds),
      )
      .then(() => {
        setting.getAutoPassword().then(() => {
          setting.getAutoPassword();
          setting.getAutoPassword();
          setVisible(false);
        });
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const handleStopPassword = () => {
    setting.stopPassword().then(() => {
      setting.getAutoPassword();
      setting.getAutoPassword();
      setVisible(false);
    });
  };

  return (
    <>
      <Card>
        <Title level={3}>Cài đặt tự động cập nhập mật khẩu thiết bị</Title>
        <Typography className={styles.itemForm}>
          {' '}
          {setting.timePassword !== -1 ? 'Đang chạy' : 'Đang tạm dừng'}
        </Typography>
        {setting.timePassword !== -1 && (
          <Typography className={styles.itemForm}>
            {`
              Chu kỳ cập nhập:
              ${Math.floor(setting.timePassword / 86400)} ngày
              ${Math.floor(
                (setting.timePassword - Math.floor(setting.timePassword / 86400) * 86400) / 3600,
              )} giờ
              ${Math.floor(
                (setting.timePassword -
                  Math.floor(setting.timePassword / 86400) * 86400 -
                  Math.floor(
                    (setting.timePassword - Math.floor(setting.timePassword / 86400) * 86400) /
                      3600,
                  ) *
                    3600) /
                  60,
              )} phút
              ${Math.floor(setting.timePassword % 60)} giây
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

        {setting.timePassword !== -1 && (
          <Button
            type="primary"
            style={{ marginLeft: '32px' }}
            htmlType="button"
            onClick={handleStopPassword}
            className={styles.itemFormButton}
            loading={setting.loading[2]}
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
          loading={setting.loading[2]}
        >
          Cập nhập thủ công
        </Button>
      </Card>

      <Drawer title="Cập nhập" width={720} onClose={onClose} open={visible}>
        <Form
          name="basic"
          form={form}
          className={styles.formNmap}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={setting.dataAutoPassword}
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
              loading={setting.loading[2]}
            >
              Cập nhập
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default SettingPassword;
