/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { IBlackListIpRecord } from '@/models/blacklistip';
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
import React, { useRef, useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormListIp from './components/Form';
import notificationAlert from '@/components/Notification';

const Index = (props) => {
  const blacklistip = useModel('blacklistip');
  const { idDevice } = props;
  const pathname = window.location.pathname;
  const arrPath = pathname.split('/');
  // const handleEdit = (record: IBlackListIpRecord) => {
  //   blacklistip.dispatch.handleForm(true, true, record);

  // }

  const [listIP, setListIP] = useState([]);

  const { setListDevicesBlackList, removeListIPFromDevices } = useModel('devices');

  // const handleDel = async (record: IBlackListIpRecord) => {
  //   await blacklistip.dispatch.del(record?.id ?? '');
  // }

  const renderLast = (value: any, record: IBlackListIpRecord) => (
    <React.Fragment>
      {/* <Button
        type="primary"
        shape="circle"
        icon={<EditOutlined />}
        disabled={arrPath?.[2] !== '1'}
        title="Chỉnh sửa"
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
              blacklistip: record?.id,
            },
            'black',
            () => {
              notificationAlert('success', 'Xoá thành công');
              blacklistip.value.setDanhSach([]);
              setListIP([]);
              blacklistip.dispatch.get({ page: 1, limit: 10 });
            },
          );
        }}
      >
        <Button type="danger" shape="circle" icon={<DeleteOutlined />} title="Xóa" />
      </Popconfirm>
    </React.Fragment>
  );
  const columns: ProColumns<IBlackListIpRecord>[] = [
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
    // arrPath?.[1] !== 'device' && {
    //   title: 'Thao tác',
    //   hideInSearch: true,
    //   align: 'center',
    //   render: (value: any, record: IBlackListIpRecord) => renderLast(value, record),
    //   fixed: 'right',
    //   width: 200,
    // },
    {
      title: 'Thao tác',
      hideInSearch: true,
      align: 'center',
      render: (value: any, record: IBlackListIpRecord) => renderLast(value, record),
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
        onClick={blacklistip.del_all}
        style={{ marginBottom: 10, position: 'absolute', zIndex: 1, top: '68px', right: '48px' }}
      >
        Xóa tất cả
      </Button>
      <TableBase
        model={blacklistip}
        title="Quản lý danh sách ip bị chặn"
        columns={columns}
        // hasCreate={arrPath?.[1] !== 'device'}
        hasCreate={true}
        hasSearch={false}
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
            x: 1000,
          },
        }}
      ></TableBase>
    </>
  );
};

export default Index;
