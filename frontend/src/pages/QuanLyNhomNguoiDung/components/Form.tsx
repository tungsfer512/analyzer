/* eslint-disable no-underscore-dangle */
import { IGroupRecord } from '@/models/groups';
import rules from '@/utils/rules';
import { Form, Input, Button, Card, Spin, DatePicker, InputNumber, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import TreeMenus from './TreeMenus';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const FormGroup = () => {
  const [form] = Form.useForm();
  const groupsModel = useModel('groups');
  const menusModel = useModel('menus');
  useEffect(() => {
    menusModel.dispatch.get({
      page: 1,
      limit: 10000,
      cond: {},
    });
  }, []);
  const handleFinish = async (values: IGroupRecord) => {
    if (groupsModel.value.edit) {
      if (groupsModel?.value?.record?.id) {
        await groupsModel.dispatch.upd({
          ...groupsModel?.value?.record,
          ...values,
          id: groupsModel?.value?.record?.id,
        });
      } else {
        await groupsModel.dispatch.add(values);
      }
    } else {
      await groupsModel.dispatch.add(values);
    }
  };
  console.log(form.getFieldsValue(), 'form.getFieldValue()');
  return (
    <Spin spinning={groupsModel.value.loading}>
      <Card title={groupsModel.value.edit ? 'Chỉnh sửa' : 'Thêm mới'}>
        <Form
          {...layout}
          form={form}
          onFinish={handleFinish}
          initialValues={{
            ...(groupsModel?.value?.record ?? {}),
          }}
        >
          <Form.Item label="Tên nhóm người dùng" name="name" rules={[...rules.required]}>
            <Input placeholder="Tên nhóm người dùng" />
          </Form.Item>
          <Form.Item
            label="Menu"
            name="menus"
            initialValue={groupsModel?.value?.record?.menus ?? []}
            rules={[...rules.required]}
          >
            <TreeMenus />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              {groupsModel.value?.edit ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default FormGroup;
