/* eslint-disable no-underscore-dangle */
import { IUserRecord } from '@/models/users';
import rules from '@/utils/rules';
import { Form, Input, Button, Card, Select, Spin, InputNumber, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import moment from 'moment';

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const FormBaiHat = () => {
  const [form] = Form.useForm();
  const usersModel = useModel('users');
  const groupsModel = useModel('groups');
  useEffect(() => {
    groupsModel.dispatch.get({
      page: 1,
      limit: 10000,
    });
  }, []);
  const handleFinish = async (values: IUserRecord) => {
    values.last_login = moment().format('DD/MM/YYYY hh:mm:ss.000000');
    if (usersModel.value.edit) {
      if (usersModel?.value?.record?.id) {
        values.date_joined = moment(values.date_joined).format('DD/MM/YYYY hh:mm:ss.000000');
        await usersModel.dispatch.upd({
          ...usersModel?.value?.record,
          ...values,
          id: usersModel?.value?.record?.id,
        });
      } else {
        values.date_joined = moment().format('DD/MM/YYYY hh:mm:ss.000000');
        values.is_active = true;
        values.is_staff = true;
        values.is_superuser = false;
        delete values.confirmPassword;

        await usersModel.dispatch.add(values);
      }
    } else {
      values.date_joined = moment().format('DD/MM/YYYY hh:mm:ss.000000');
      values.is_active = true;
      values.is_staff = true;
      values.is_superuser = false;
      delete values.confirmPassword;
      await usersModel.dispatch.add(values);
    }
  };
  console.log(groupsModel.value, 'form.getFieldValue()');
  return (
    <Spin spinning={usersModel.value.loading}>
      <Card title={usersModel.value.edit ? 'Chỉnh sửa' : 'Thêm mới'}>
        <Form
          {...layout}
          form={form}
          onFinish={handleFinish}
          initialValues={{
            ...(usersModel?.value?.record ?? {}),
          }}
        >
          <Form.Item label="Username" name="username" rules={[...rules.required]}>
            <Input placeholder="Username" disabled={usersModel?.value?.edit} />
          </Form.Item>
          {!usersModel?.value?.edit && (
            <>
              <Form.Item label="Mật khẩu" name="password" rules={[...rules.required]}>
                <Input placeholder="Mật khẩu" type="password" />
              </Form.Item>
              <Form.Item
                label="Nhập lại mật khẩu"
                name="confirmPassword"
                rules={[
                  ...rules.required,
                  {
                    validator: (_, value, callback) => {
                      if (value !== form.getFieldValue('password')) callback('');
                      callback();
                    },
                    message: 'Mật khẩu không khớp',
                  },
                ]}
              >
                <Input placeholder="Nhập lại mật khẩu" type="password" />
              </Form.Item>
            </>
          )}
          <Form.Item label="Họ tên đệm" name="first_name" rules={[...rules.required]}>
            <Input placeholder="Họ tên đệm" />
          </Form.Item>
          <Form.Item label="Tên" name="last_name" rules={[...rules.required]}>
            <Input placeholder="Tên" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[...rules.required]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Thuộc nhóm" name="groups" rules={[...rules.required]}>
            <Select placeholder="Thuộc nhóm..." mode="multiple">
              {groupsModel?.value?.danhSach?.map((item) => (
                <Select.Option value={item.id}>{item.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              {usersModel.value?.edit ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default FormBaiHat;
