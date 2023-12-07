/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { IWhiteListIpRecord } from '@/models/whitelistip';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Divider, Popconfirm, Checkbox } from 'antd';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import { useModel } from 'umi';
import FormListIp from './components/Form';
import notificationAlert from '@/components/Notification';

const Index = (props) => {
  const whitelistip = useModel('whitelistip');
  const { idDevice } = props;
  const pathname = window.location.pathname;
  const arrPath = pathname.split('/');

  const { setListDevicesWhiteList, removeListIPFromDevices } = useModel('devices');

  const [listIP, setListIP] = useState([]);

  // const handleEdit = (record: IWhiteListIpRecord) => {
  //   whitelistip.dispatch.handleForm(true, true, record);

  // }

  // const handleDel = async (record: IWhiteListIpRecord) => {
  //   await whitelistip.dispatch.del(record?.id ?? '');
  // }

  const renderLast = (value: any, record: IWhiteListIpRecord) => (
    <React.Fragment>
      {/* <Button
        type="primary"
        shape="circle"
        icon={<EditOutlined />}
        title="Chỉnh sửa"
        disabled={arrPath?.[2] !== '1'}
        onClick={() => handleEdit(record)}
      /> */}
      {/* <Divider type="vertical" /> */}
      <Popconfirm
        title="Bạn có muốn xóa?"
        okText="Có"
        cancelText="Không"
        onConfirm={async () => {
          removeListIPFromDevices(
            {
              // id: [idDevice],
              whitelistip: record?.id,
            },
            'white',
            () => {
              notificationAlert('success', 'Xoá thành công');
              whitelistip.value.setDanhSach([]);
              setListIP([]);
              whitelistip.dispatch.get({ page: 1, limit: 10 });
            },
          );
        }}
      >
        <Button type="danger" shape="circle" icon={<DeleteOutlined />} title="Xóa" />
      </Popconfirm>
    </React.Fragment>
  );
  const columns: ProColumns<IWhiteListIpRecord>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      hideInSearch: false,
      width: 400,
      align: 'center',
    },
    {
      title: 'Đường dẫn',
      dataIndex: 'url',
      hideInSearch: false,
      width: 400,
      align: 'center',
    },
    {
      title: 'Thao tác',
      hideInSearch: true,
      align: 'center',
      render: (value: any, record: IWhiteListIpRecord) => renderLast(value, record),
      fixed: 'right',
      width: 200,
    },
  ];

  const rowSelection = {
    onChange: (selected: React.Key[], selectedRows: DataType[]) => {
      if (selectedRows.length === 0) {
        props.selectedRowKeys([]);
      }
    },
    selectedRowKeys: props.listIP,
    renderCell: (checked, record, index, _) => {
      return (
        <Checkbox
          onChange={(e) => {
            console.log(record);
            let tmp = props.listIP;
            if (!e.target.checked) {
              tmp = tmp.filter((item) => item !== record?.key);
              props.selectedRowKeys(tmp);
            } else {
              tmp = tmp.concat(record?.key);
              props.selectedRowKeys(tmp);
            }
          }}
          checked={checked}
        />
      );
    },
  };

  return (
    <>
      <Button
        type="primary"
        onClick={whitelistip.del_all}
        style={{ marginBottom: 10, position: 'absolute', zIndex: 1, top: '68px', right: '48px' }}
      >
        Xóa tất cả
      </Button>
      <TableBase
        model={whitelistip}
        title="Quản lý danh sách ip được phép"
        columns={columns}
        hasCreate={true}
        {...(props.listIP && {
          moreButton: props.moreButton,
        })}
        Form={<FormListIp />}
        {...(props.listIP && {
          rowSelection: {
            type: 'checkbox',
            ...rowSelection,
          },
        })}
        otherProps={{
          scroll: {
            x: 1200,
          },
        }}
      />
    </>
  );
};

export default Index;
