/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
import TableBase from "@/components/Table";
import { IMenuRecord } from "@/models/menus";
import { DeleteOutlined, EditOutlined, EyeOutlined, UploadOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { ActionType, ProColumns } from "@ant-design/pro-table";
import { Button, Divider, Popconfirm, Typography } from "antd";
import moment from 'moment';
import React, { useRef } from "react";
import { useModel } from "umi";
import FormUser from './components/Form';

const Index = () => {
  const menusModel = useModel('menus');

  const handleEdit = (record: IMenuRecord) => {
    menusModel.dispatch.handleForm(true, true, record);

  }

  const handleDel = async (record: IMenuRecord) => {
    await menusModel.dispatch.del(record?.id ?? '');
  }

  const renderLast = (value: any, record: IMenuRecord) => (
    <React.Fragment>
      <Button
        type="primary"
        shape="circle"
        icon={<EditOutlined />}
        title="Chỉnh sửa"
        onClick={() => handleEdit(record)}
      />
      <Divider type="vertical" />
      <Popconfirm
        title="Bạn có muốn xóa?"
        okText="Có"
        cancelText="Không"
        onConfirm={() => handleDel(record)}
      >
        <Button
          type="danger"
          shape="circle"
          icon={<DeleteOutlined />}
          title="Xóa"
        />
      </Popconfirm>
    </React.Fragment>
  )
  const columns: ProColumns<IMenuRecord>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tên menu',
      dataIndex: 'name',
      hideInSearch: false,
      width: 300,
      align: 'center',
    },
    {
      title: 'Mã menu',
      dataIndex: 'code',
      hideInSearch: false,
      width: 300,
      align: 'center',
    },
    {
      title: 'Mã menu cha',
      dataIndex: 'code_parent',
      hideInSearch: false,
      align: 'center',
    },
    {
      title: 'Thao tác',
      hideInSearch: true,
      align: 'center',
      render: (value: any, record: IMenuRecord) => renderLast(value, record),
      fixed: 'right',
      width: 200,
    },
  ]

  return (
    <>
      <TableBase
        model={menusModel}
        title="Quản lý menu"
        columns={columns}
        hasCreate={true}
        Form={<FormUser />}
        otherProps={{
          scroll: {
            x: 1200,
          }
        }}
      />
    </>
  );
};

export default Index;
