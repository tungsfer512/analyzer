import { IP_SERVER } from '@/utils/constants';
import { InboxOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Divider, Form, Spin, Row, Col, Upload, List, Table, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { request  } from 'umi';
import CustomUpload from '@/components/Upload/Upload';
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const normFile = (e) => {
  // console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

export default (): React.ReactNode => {
  useEffect(() => {});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const dividerElementRef = useRef(null);

  const onFinish = (values: any) => {
    // console.log('Received values of form: ', values);
    const formData = new FormData();
    formData.append('actualFile', values.actualFile[0].originFileObj);
    values.files.forEach((file: any) => formData.append('files', file.originFileObj));
    setLoading(true);
    request(`${IP_SERVER}/upload`, { method: 'post', data: formData, getResponse: true })
      .then(({ data, response }) => {
        setData(data);
        console.log('data :>> ', data, response);
      })
      .catch(function (error) {
        // console.log('error :>> ', error);
      })
      .finally(() => {
        setLoading(false);
        dividerElementRef.current.focus();
      });
  };

  return (
    <PageContainer>
      <Spin spinning={loading}>
        <Card>
          <Form
            name="validate_other"
            {...formItemLayout}
            onFinish={onFinish}
            initialValues={{
              ['input-number']: 3,
              ['checkbox-group']: ['A', 'B'],
              rate: 3.5,
            }}
          >
            <Row>
              <Col xs={24} md={12}>
                <Form.Item label="Các tập tin của thí sinh">
                  <Form.Item
                    name="files"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    noStyle
                    rules={[{ required: true, message: 'Hãy tải lên các tập tin' }]}
                  >
                    <CustomUpload multiple={true} />
                  </Form.Item>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Tập tin đáp án">
                  <Form.Item
                    rules={[{ required: true, message: 'Hãy tải lên duy nhất 1 tập tin' }]}
                    name="actualFile"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    noStyle
                  >
                    <CustomUpload />
                  </Form.Item>
                </Form.Item>
              </Col>
              <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                <Button type="primary" htmlType="submit">
                  Bắt đầu chấm
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </Card>
        <Divider orientation="left">Kết quả chấm</Divider>
        <div ref={dividerElementRef} />
        <Table
          columns={[
            {
              title: 'Tên thí sinh',
              dataIndex: 'tenThiSinh',
              key: 'tenThiSinh',
              // render: (text) => <a>{text}</a>,
            },
            {
              title: 'Kết quả',
              dataIndex: 'ketQua',
              key: 'ketQua',
            },
          ]}
          dataSource={data}
        />
      </Spin>
    </PageContainer>
  );
};
