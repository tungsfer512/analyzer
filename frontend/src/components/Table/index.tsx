/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Button, Card, Drawer } from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { useRef } from 'react';
import { ActionType } from '@ant-design/pro-table';
import { toRegex } from '@/utils/utils';
import { PlusOutlined } from '@ant-design/icons';

export default ({ model, columns = [], hasCreate = false, title = '', Form,
  actionRef = useRef(), cond = {}, otherProps = {}, drawerProps = {},
  moreButton = [], hasSearch = true,
  rowSelection
}) => {
  const handleAdd = () => {
    model.dispatch.handleForm(true, false, {});
  }
  const columnsTable: ProColumns<any>[] = columns.map(item => {
    if (item?.hideInSearch === undefined) {
      return ({
        ...item,
        hideInSearch: true,
      })
    }
    if (item?.hideInSearch === false) {
      hasSearch = true;
    }
    return item;
  })
  return (
    <Card
      title={title ?? ''}
      bodyStyle={{ paddingTop: 0 }}
    >
      <div style={{ paddingLeft: 24, marginBottom: -15, marginTop: 10 }}>
        {hasCreate && <Button type="primary" style={{ marginRight: 10 }} onClick={handleAdd} icon={<PlusOutlined />}>Thêm mới</Button>}
        {moreButton?.map(item =>
          item
        )}
      </div>

      {/* <Table dataSource={topics?.value?.danhSach} columns={columns} bordered/> */}
      <ProTable
        bordered
        // search={false}
        // toolBarRender={() => [
        //   hasCreate && <Button type="primary" onClick={handleAdd}> <PlusOutlined /> Thêm mới</Button>,
        //   ...moreButton,
        // ]}
        {...rowSelection && {
          rowSelection: {
            ...rowSelection,
          }
        }}
        options={false}
        loading={model.value?.loading ?? false}
        actionRef={model?.value?.actionRef ?? useRef()}
        pagination={{
          pageSize: 10,
        }}
        search={hasSearch ? {
          layout: 'vertical',
          defaultCollapsed: false,
          style: {
            paddingTop: 0
          }
        } : false}
        request={async (params, sort, filter) => {
          // console.log("params", params);
          Object.keys(filter).map(item => {
            if (filter[item] == null) {
              delete filter[item];
            }
          })
          console.log(sort, filter)
          const current = params?.current ?? 1;
          const pageSize = params?.pageSize ?? 10;
          delete params.current;
          delete params.pageSize;
          let tmp = {}
          let tmpSort = {};
          let tmpFilter = {};
          Object.keys(params).map(item => {
            tmp[item] = toRegex(params[item]);
          })
          if (filter) {
            Object.keys(filter).map(item => {
              tmpFilter[item] = {
                "$in": filter[item],
              };
            })
          }
          if (cond) {
            cond = {
              ...cond,
              ...tmpFilter,
              ...tmp,
              // ...params
            }
          } else cond = {};
          if (sort) {
            Object.keys(sort).map(item => {
              tmpSort[item] = sort[item] === 'ascend' ? 1 : -1;
            })
          }

          const paramsGet = {};

          const dataGet = () => {
            if (Object.keys(params).length > 0) {
              Object.keys(params).map(item => {
                if(params[item] !== undefined && params[item] !== null && params[item] !== ''){
                  paramsGet[item] = params[item];
                }
              })
            }
          }

          dataGet();
          paramsGet['current'] = current;
          paramsGet['pageSize'] = pageSize;
          console.log("paramsGet", paramsGet);

          const { data, total } = await model.dispatch.get(paramsGet)
          return ({
            data,
            total,
          })
        }}
        dataSource={(model.value.danhSach || []).map((item, index) => ({
          ...item,
          index: index + 1,
          }))}
        columns={columnsTable}
        style={{ marginTop: 15 }}
        {...otherProps}
      />
      <Drawer
        visible={model?.value?.showDrawer ?? false}
        closable
        onClose={() => model.dispatch.handleForm(false, false, {})}
        width="60%"
        destroyOnClose
        {...drawerProps}
      >
        {Form}
        {/* {Form &&
          <Form
            onSubmit={reloadTable}
          />
        } */}
      </Drawer>
    </Card>
  )
}
