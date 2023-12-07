import React, { useEffect } from 'react';
import { Button, Card, Checkbox, Divider, Drawer, Form, Input, Spin } from 'antd';
import { useModel } from 'umi';
import styles from './index.less';
import Title from 'antd/lib/typography/Title';
import Typography from 'antd/lib/typography/Typography';
import { put_auto_check_overload } from '@/services/Setting/autocheckoverload';

const SettingAutoCheckOverload = () => {
  const agents = useModel('agents');
  const [visible, setVisible] = React.useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    agents.getAutoCheckOverload();
  }, []);

  const handleEdit = () => {
    if (agents.timeCheckOverload == -1) {
      form.setFieldsValue({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    }
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onFinish = (values: any) => {
    console.log('Success:', values);
    let { days, hours, minutes, seconds } = values;
    if (days == undefined) days = 0;
    if (hours == undefined) hours = 0;
    if (minutes == undefined) minutes = 0;
    if (seconds == undefined) seconds = 0;
    console.log(
      Number(days) * 24 * 60 * 60 +
        Number(hours) * 60 * 60 +
        Number(minutes) * 60 +
        Number(seconds),
    );
    agents
      .updateAutoCheckOverload(
        Number(days) * 24 * 60 * 60 +
          Number(hours) * 60 * 60 +
          Number(minutes) * 60 +
          Number(seconds),
      )
      .then(() => {
        agents.getAutoCheckOverload();
        setVisible(false);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Card>
        <Title level={3}>Cài đặt tự động cập nhập chu kỳ tìm kiếm IOT Analyzer tốt nhất</Title>
        <Typography className={styles.itemForm}>
          {' '}
          {agents.timeCheckOverload !== -1 ? 'Đang chạy' : 'Đang tạm dừng'}
        </Typography>
        {agents.timeCheckOverload !== -1 && (
          <Typography className={styles.itemForm}>
            {`
              Chu kỳ cập nhập:
              ${Math.floor(agents.timeCheckOverload / 86400)} ngày
              ${Math.floor(
                (agents.timeCheckOverload - Math.floor(agents.timeCheckOverload / 86400) * 86400) /
                  3600,
              )} giờ
              ${Math.floor(
                (agents.timeCheckOverload -
                  Math.floor(agents.timeCheckOverload / 86400) * 86400 -
                  Math.floor(
                    (agents.timeCheckOverload -
                      Math.floor(agents.timeCheckOverload / 86400) * 86400) /
                      3600,
                  ) *
                    3600) /
                  60,
              )} phút
              ${Math.floor(agents.timeCheckOverload % 60)} giây
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
      </Card>

      <Drawer title="Cập nhập" width={720} onClose={onClose} open={visible}>
        <Form
          name="basic"
          form={form}
          className={styles.formNmap}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={agents.timeCheckOverload}
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
              loading={agents.loading[0]}
            >
              Cập nhập
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default SettingAutoCheckOverload;
