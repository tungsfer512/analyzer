/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
import TableBase from "@/components/Table";
import { IGroupRecord } from "@/models/groups";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ProColumns } from "@ant-design/pro-table";
import { Button, Divider, Popconfirm } from "antd";
import React from "react";
import { useModel } from "umi";
import FormGroup from './components/Form';

const Index = () => {
  const groupsModel = useModel('groups');
  const handleEdit = (record: IGroupRecord) => {
    groupsModel.dispatch.handleForm(true, true, record);

  }

  const handleDel = async (record: IGroupRecord) => {
    await groupsModel.dispatch.del(record?.id ?? '');
  }

  const renderLast = (value: any, record: IGroupRecord) => (
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
  const columns: ProColumns<IGroupRecord>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tên nhóm người dùng',
      dataIndex: 'name',
      hideInSearch: false,
      width: 400,
      align: 'center',
    },
    {
      title: 'Thao tác',
      hideInSearch: true,
      align: 'center',
      render: (value: any, record: IGroupRecord) => renderLast(value, record),
      fixed: 'right',
      width: 200,
    },
  ]

  return (
    <>
      <TableBase
        model={groupsModel}
        title="Quản lý nhóm ngời dùng"
        columns={columns}
        hasCreate={true}
        Form={<FormGroup />}
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
