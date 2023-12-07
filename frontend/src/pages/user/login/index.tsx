import {
  AlipayCircleOutlined,
  LockTwoTone,
  MailTwoTone,
  MobileTwoTone,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, Space, message, Tabs, Modal, Radio, Form , notification} from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { useIntl, Link, history, FormattedMessage, SelectLang } from 'umi';
import Footer from '@/components/Footer';
import type { LoginParamsType } from '@/services/login';
import { login } from '@/services/login';
import { useModel } from 'umi';
// import router from 'umi/router';

import styles from './index.less';
import { getCurrentInfo } from '@/services/user';
import rules from '@/utils/rules';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<{}> = () => {
  const [submitting, setSubmitting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userLoginState, setUserLoginState] = useState<API.LoginStateType>({});
  const [form] = Form.useForm();
  const [type, setType] = useState<string>('account');
  const [vaiTro, setVaiTro] = useState(undefined);
  const intl = useIntl();
  const onChangeVaiTro = (e) => {
    setVaiTro(e.target.value);
  };

  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);

    try {
      const msg = await login({ ...values });
      // Save token to local storage
      console.log(msg, 'msg');
      const token = msg.auth_token;
      const groupMenusResponse = await getCurrentInfo(values.username);
      console.log(groupMenusResponse?.data);

      Modal.confirm({
        content: (
          <>
            <p>Đăng nhập với vai trò 3</p>
            <Form
              form={form}
              onFinish={(e) => {
                if (e && e.vaiTro) {
                  localStorage.setItem('token', token);
                  localStorage.setItem('vaiTro', e.vaiTro);
                  localStorage.setItem('username', values.username);
                  window.location.href = '/';
                } else {
                  message.error('Vui lòng chọn vai trò')
                }
              }}
            >
              <Form.Item name="vaiTro"
              // rules={[[...rules.required]]}
              >
                <Radio.Group>
                  <Space direction="vertical">
                    {groupMenusResponse?.data.map((item) => (
                      <Radio value={item?.group?.id}>{item?.group?.name}</Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Form>
          </>
        ),
        onOk: () => {
          form.submit();
        },
        okText: 'Đăng nhập',
        cancelText: 'Thoát',
      });
    } catch (error) {
      message.error('Sai thông tin đăng nhập');
    }
    setSubmitting(false);
  };
  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.lang}>{SelectLang && <SelectLang />}</div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src="/logo.jpg" />
              <span className={styles.title}>Analyzer</span>
            </Link>
          </div>
          <div className={styles.desc}>Công cụ Analyzer</div>
        </div>

        <div className={styles.main}>
          <ProForm
            initialValues={{
              autoLogin: true,
            }}
            submitter={{
              searchConfig: {
                submitText: intl.formatMessage({
                  id: 'pages.login.submit',
                  defaultMessage: 'Đăng nhập',
                }),
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => {
              handleSubmit(values);
            }}
          >
            <Tabs activeKey={type} onChange={setType}>
              <Tabs.TabPane
                key="account"
                tab={intl.formatMessage({
                  id: 'pages.login.accountLogin.tab',
                  defaultMessage: 'Tài khoản',
                })}
              />
            </Tabs>

            {status === 'error' && loginType === 'account' && (
              <LoginMessage
                content={intl.formatMessage({
                  id: 'pages.login.accountLogin.errorMessage',
                  defaultMessage: 'Thông tin đăng nhập（admin/ant.design)',
                })}
              />
            )}
            {type === 'account' && (
              <>
                <ProFormText
                  name="username"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.username.placeholder',
                    defaultMessage: 'Nhập tài khoản',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.username.required"
                          defaultMessage="Yêu cầu mật khẩu!"
                        />
                      ),
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockTwoTone className={styles.prefixIcon} />,
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.password.placeholder',
                    defaultMessage: 'Nhập mật khẩu',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.password.required"
                          defaultMessage="Yêu cầu mật khẩu"
                        />
                      ),
                    },
                  ]}
                />
              </>
            )}
          </ProForm>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Login;
