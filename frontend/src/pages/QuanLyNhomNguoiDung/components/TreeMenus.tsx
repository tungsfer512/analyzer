import React from 'react';
import { Row, Collapse, Col, Table, Checkbox } from 'antd';
import { useModel } from 'umi';
import { IMenuRecord } from '@/models/menus';

const TreeMenus = (props) => {
  const value = props?.value ?? [];
  const menusModel = useModel('menus');
  const unCheckAllowChildren = (arrAllow, menu: IMenuRecord) => {
    let tmpArr = Array.from(arrAllow);
    menusModel.value.danhSach.map((item) => {
      if (item.code_parent === menu.code) {
        let flag = 0;
        tmpArr.map((e) => {
          if (e === item.id) {
            flag = item.id;
          }
        });
        if (flag !== 0) {
          tmpArr = tmpArr.filter((item) => item !== flag);
        }
        tmpArr = unCheckAllowChildren(tmpArr, item);
      }
    });
    return tmpArr;
  };
  const changeAllow = (checked, menu) => {
    let flag = false;
    value?.map((item) => {
      if (item === menu.id) {
        flag = true;
      }
    });
    let tmpValue;
    if (flag) {
      tmpValue = value.filter((item) => item !== menu.id);
    } else {
      tmpValue = value.concat(menu.id);
    }
    if (!checked && menu.code_parent !== 'NULL') {
      const code_parent = menu.code_parent;
      const parent = menusModel.value.danhSach.filter((item) => item.code === code_parent)?.[0];
      let flagParent = false;
      menusModel.value.danhSach.map((item) => {
        if (item.code_parent === code_parent) {
          tmpValue.map((e) => {
            if (e === item.id) {
              flagParent = true;
            }
          });
        }
      });
      if (!flagParent) {
        tmpValue = tmpValue.filter((item) => item != parent?.id);
      }
    }
    if (checked && menu.code_parent !== 'NULL') {
      const code_parent = menu.code_parent;
      const parent = menusModel.value.danhSach.filter((item) => item.code === code_parent)?.[0];
      let flag = false;
      tmpValue.map((item) => {
        if (item === parent.id) {
          flag = true;
        }
      });
      if (!flag) {
        tmpValue = tmpValue.concat(parent.id);
      }
    }
    if (!checked) {
      tmpValue = unCheckAllowChildren(tmpValue, menu);
    }
    props.onChange(tmpValue);
  };
  const renderData = (code: string) => {
    const tmpArr = menusModel.value.danhSach
      .filter((item) => item.code_parent === code)
      .map((item) => {
        const allow = value?.filter((e) => e === item.id)?.[0] ?? false;
        const children = renderData(item.code);
        return {
          ...item,
          children,
          allow,
          key: item.id,
        };
      });
    return tmpArr;
  };
  const data = renderData('NULL');
  console.log(props, 'data');
  return (
    <Table
      bordered
      columns={[
        {
          title: 'Tên menu',
          dataIndex: 'name',
          align: 'left',
          width: 500,
        },
        {
          title: 'Cho phép',
          dataIndex: 'allow',
          align: 'center',
          width: 200,
          render: (value, record) => (
            <Checkbox checked={value} onChange={(e) => changeAllow(e.target.checked, record)} />
          ),
        },
      ]}
      dataSource={data}
    />
  );
};

export default TreeMenus;
