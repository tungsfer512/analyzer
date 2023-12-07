import { Divider, List, Spin, Table, Typography } from 'antd';
import { useModel } from 'umi';
import styles from './index.less';
import Title from 'antd/lib/typography/Title';
import SettingAgent from './SettingAgent';
import SettingBlackList from './SettingBlackList';
import SettingWhiteList from './SettingWhiteList';

import { Collapse } from 'antd';

const { Panel } = Collapse;

const renderPreText = (text: string[]) => {
  return (
    <pre className={styles.huongdanText}>
      {text.map((item) => (
        <p>{item}</p>
      ))}
    </pre>
  );
};

const Setting = () => {
  const setting = useModel('setting');

  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  return (
    // <Spin spinning={ettercap.loading}>
    <div className={styles.nmapGlobal}>
      <Collapse defaultActiveKey={['1']} onChange={onChange}>
        <Panel header="Cài đặt tự động cập nhật Agent" key="1" className={styles.panelDlpmain}>
          <SettingAgent />
        </Panel>
        <Panel header="Cài đặt tự động cập nhật Blacklist" key="2" className={styles.panelDlpmain}>
          <SettingBlackList />
        </Panel>
        <Panel header="Cài đặt tự động cập nhật Whitelist" key="3" className={styles.panelDlpmain}>
          <SettingWhiteList />
        </Panel>
      </Collapse>
    </div>
    // </Spin>
  );
};

export default Setting;
