import { ip } from '@/utils/ip';
import viVNIntl from 'antd/lib/locale/vi_VN';
import ProTable, { IntlProvider } from '@ant-design/pro-table';
import { DownloadOutlined } from '@ant-design/icons';
import { ConfigProvider, Divider, List, Spin, Table, Select, DatePicker, Modal, Typography, Form, Upload, UploadFile, Button, Input, message, Image, Card } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import styles from './index.less';
import rules from '@/utils/rules';

const { RangePicker } = DatePicker;

const ExtractFile = () => {
  const extractFilesModel = useModel('extractFiles');

  const [selectedFile, setSelectedFile] = useState(null);
  const [activate, setActivate] = useState(false);

  useEffect(() => {
    extractFilesModel.getDevices();
    console.log('data', extractFilesModel.devices);
  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault()
    const formExtractFile = document.getElementById('formExtractFile') as HTMLFormElement;
    const formData = new FormData(formExtractFile);
    if (selectedFile == null) {
      message.warning("Vui lòng chọn file đầu vào")
      return
    }
    extractFilesModel.up({ formData });
    setActivate(true);
  }

  const handleAutoExtract = async (event) => {
    event.preventDefault()
    console.log("-=-=--==-=-=-=-=-=-=-=-=-=-==-");
    
  }

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files)
  }

  const handleDownloadAll = (event) => {
    event.preventDefault()
    extractFilesModel.dowloadAll();
  }

  const handleDownload = (event) => {
    console.log("---------------------------", event)
    extractFilesModel.dowload(event);
  }
  const [isModalchoosePcapVisible, setModalchoosePcapVisible] = useState(false);

  const [choosePcapForm] = Form.useForm();

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const onchoosePcapFormFinish = (values: any) => {
    console.log('values', values);
    extractFilesModel.autoExtract(values)
  };
  const handlechoosePcapOk = () => {
    choosePcapForm
      .validateFields()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then((values) => {
        // Submit Form
        choosePcapForm.submit();
        setModalchoosePcapVisible(false);
      })
      .catch((errInfo) => {
        // eslint-disable-next-line no-console
        console.log('Error===>', errInfo);
      });
  };

  const handlechoosePcapCancel = () => {
    setModalchoosePcapVisible(false);
  };

  const showModalchoosePcap = async () => {
    // setClickedCard(el);
    setModalchoosePcapVisible(true);
  };

  const renderLast = (value: any, record) => (
    <React.Fragment>
      <Button
        type="primary"
        shape="circle"
        icon={<DownloadOutlined />}
        title="Tải xuống"
        onClick={() => handleDownload(record)}
      />
    </React.Fragment>
  );

  const columns = [
    {
      dataIndex: 'index',
      title: 'STT',
      width: 30,
      hideInSearch: true,
    },
    {
      title: 'Tên tập tin',
      dataIndex: 'name',
      width: 300,
    },
    {
      title: 'Tải xuống',
      dataIndex: 'abc',
      hideInSearch: true,
      key: 'abc',
      width: 100,
      // fixed: 'right',
      align: 'center',
      render: (value, record) => renderLast(value, record),
    },
  ];

  return (
    // <Spin spinning={ettercap.loading}>
    <div className={styles.nmapGlobal}>
      <Card>
        <div className={styles.upfileForm}>
          <div className={styles.dowload}>
            <Typography.Title className={styles.dowloadTitle} level={4}>Trích xuất tập tin từ dữ liệu luồng mạng</Typography.Title>
          </div>
          <Form id="formExtractFile" name='upload' className={styles.form} layout='inline'>
            <Form.Item label='File dữ liệu luồng mạng cần trích xuất (.pcap)' required >
              <Input name="file" type="file" onChange={handleFileSelect} accept=".pcap" multiple />
            </Form.Item>
            <div className={styles.xxx}>
              <Button type="primary" className={styles.button} onClick={handleSubmit} loading={extractFilesModel?.loading}>Trích xuất từ file PCAP</Button>
              <Button type="primary" className={styles.button} onClick={async () => await showModalchoosePcap()} loading={extractFilesModel?.loading2}>Trích xuất từ luồng mạng</Button>
            </div>
          </Form>
        </div>
      </Card>

      <Card>
        <div className={styles.dowloadForm}>
          <div className={styles.dowload}>
            <Typography.Title className={styles.dowloadTitle} level={4}>Danh sách tập tin được trích xuất</Typography.Title>
            {/* {(activate == true) && <Button type="primary" className={styles.button} onClick={handleDownloadAll} >Tải xuống tất cả</Button>} */}

          </div>
          <ConfigProvider locale={viVNIntl}>
            <ProTable
              columns={columns}
              search={false}
              pagination={{
                defaultPageSize: 10,
                total: extractFilesModel?.data?.length,
              }}
              // tableStyle={{ height: '500px' }}
              request={async (params = {}) => {
                console.log(`params`, params);
              }}
              dataSource={(extractFilesModel?.data || []).map((item, index) => ({
                ...item,
                index: index + 1,
              }))}
              rowKey="id"
            />
          </ConfigProvider>
        </div>
      </Card>
      <Modal
        title={`Chọn file PCAP `}
        visible={isModalchoosePcapVisible}
        onOk={handlechoosePcapOk}
        onCancel={handlechoosePcapCancel}
        width={600}
      >
        <Form
          id="formchoosePcap"
          {...formItemLayout}
          form={choosePcapForm}
          name="control-hooks"
          onFinish={(values) => onchoosePcapFormFinish(values)}
        >
          <Form.Item label="Thiết bị" name="device" rules={[...rules.required]}>
              <Select>
                {extractFilesModel.devices.map((item) => (
                  <Select.Option value={item?.id}>{item?.id} - {item?.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          <Form.Item label="Thời gian" name="timestamp" rules={[...rules.required]}>
              <RangePicker allowClear style={{ width: '100%' }} />
            </Form.Item>
        </Form>
      </Modal>
    </div>
    // </Spin>
  );
};

export default ExtractFile;
