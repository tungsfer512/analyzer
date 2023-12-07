import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import React, { useState } from 'react';

const Uploader = (props) => {
  const [fileList, updateFileList] = useState([]);
  const acceptTypeList = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  const propsUpload = {
    fileList,
    multiple: !!props.multiple,
    beforeUpload: (file) => {
      if (!acceptTypeList.includes(file.type)) {
        message.error(`${file.name} Tập tin tải lên chưa đúng định dạng docx hoặc .doc`);
        return false;
      }
      // return file.type === 'image/png';
      return true;
    },
    onChange: (info) => {
      //   console.log(info.fileList);
      // file.status is empty when beforeUpload return false
      const changedValue = info.fileList.filter((file) => !!file.status);

      let tmpFileList = [...changedValue];

      // 1. Limit the number of uploaded files
      // Only to show two recent uploaded files, and old ones will be replaced by the new

      if (!props.multiple) {
        tmpFileList = tmpFileList.slice(-1);
      }
      updateFileList(tmpFileList);
      props.onChange(tmpFileList);
    },
  };

  return (
    <Upload.Dragger name="files" {...propsUpload}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Chọn hoặc kéo thả tập tin vào đây để tải lên</p>
      {props.multiple && <p className="ant-upload-hint">Hỗ trợ tải nhiều tập tin.</p>}
    </Upload.Dragger>
  );
};

export default Uploader;
