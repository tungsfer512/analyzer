/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
import TableBase from "@/components/Table";
import type { IUserRecord } from "@/models/users";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ProColumns } from "@ant-design/pro-table";
import { Button, Divider, Popconfirm } from "antd";
import React from "react";
import { useModel } from "umi";
import FormUser from './components/Form';

const Index = () => {
  const userModel = useModel('users');

  const handleEdit = (record: IUserRecord) => {
    userModel.dispatch.handleForm(true, true, record);

  }

  const handleDel = async (record: IUserRecord) => {
    await userModel.dispatch.del(record?.id ?? '');
  }

  const renderLast = (value: any, record: IUserRecord) => (
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
  const columns: ProColumns<IUserRecord>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      hideInSearch: false,
      width: 400,
      align: 'center',
    },
    {
      title: 'Họ và tên đệm',
      dataIndex: 'first_name',
      hideInSearch: false,
      width: 300,
      align: 'center',
    },
    {
      title: 'Tên',
      dataIndex: 'last_name',
      hideInSearch: false,
      width: 150,
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      hideInSearch: false,
      width: 300,
      align: 'center',
    },
    {
      title: 'Thao tác',
      hideInSearch: true,
      align: 'center',
      render: (value: any, record: IUserRecord) => renderLast(value, record),
      fixed: 'right',
      width: 200,
    },
  ]

  return (
    <>
      <TableBase
        model={userModel}
        title="Quản lý người dùng"
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
