/* eslint-disable @typescript-eslint/ban-types */
import React, { useState, useEffect } from 'react';
import { List, Avatar, Divider, Spin } from 'antd';
import moment from 'moment';
import { PageContainer } from '@ant-design/pro-layout';
import ava1 from './img/ipcam.jpg';
import { getAlerts } from '@/services/alerts';
import './style.less';

const CanhBaoMaDoc: React.FC<{}> = () => {
  const [alertData, setAlertData] = useState([]);
  const [totalAlertData, setTotalAlertData] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAlerts({}).then((res) => {
      const dataArr = res?.results?.filter((el: any) => el.type === 'MALWARE');
      setAlertData(dataArr);
      setTotalAlertData(res.count);
      setLoading(false);
    });
  }, []);

  return (
    <PageContainer>
      <Spin spinning={loading} tip="Loading...">
        <List
          size="large"
          grid={{ gutter: 8, md: 2, sm: 1, xs: 1, lg: 2, xl: 2, xxl: 2 }}
          itemLayout="horizontal"
          dataSource={alertData}
          pagination={{
            onChange: (page: any) => {
              setLoading(true);
              getAlerts({ page }).then((res) => {
                const dataArr = res.data.results.filter((el: any) => el.type === 'MALWARE');
                setAlertData(dataArr);
                setTotalAlertData(res.count);
                setLoading(false);
              });
            },
            pageSize: 10,
            total: totalAlertData,
          }}
          renderItem={(item: any) => (
            <div className="malware--item">
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={ava1} />}
                  title={
                    <a href="https://ant.design">
                      {`[${moment(item?.timestamp).format(
                        'DD/MM/YYYY hh:mm:ss',
                      )}] Phát hiện mã độc ở địa chỉ IP: ${item?.ip}`}
                    </a>
                  }
                  description={
                    <div>
                      <div>
                        <b>PID: </b> {`$${item?.pid}`}
                        <Divider type="vertical" />
                        <b>Mã Hash: </b> ${item?.timestamp}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            </div>
          )}
        />
      </Spin>
    </PageContainer>
  );
};

export default CanhBaoMaDoc;
