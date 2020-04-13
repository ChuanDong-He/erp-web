import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React from 'react';
import { Table, Button, Divider, Modal, Input, Form} from 'antd';
import styles from '@/utils/default.less';
import Search from './Search';
import EditUser from "./EditUser";
import { connect } from 'umi';
import MD5 from 'crypto-js/md5';
import {ExclamationCircleOutlined} from "@ant-design/icons";

@connect(
  ({ userInfo, loading, user }) => ({
    ...userInfo,
    currentUser: user.currentUser,
    loading: loading.effects['userInfo/queryUserInfos'],
    confirmLoading: loading.effects['userInfo/resetPassword'],
  }),
  dispatch => ({
    queryUserInfos: param => {
      dispatch({
        type: 'userInfo/queryUserInfos',
        payload: param,
      });
    },
    changeState: state => {
      dispatch({
        type: 'userInfo/changeState',
        newState: state,
      });
    },
    deleteUserInfo: param => {
      dispatch({
        type: 'userInfo/deleteUserInfo',
        payload: param,
      });
    },
    resetPassword: param => {
      dispatch({
        type: 'userInfo/resetPassword',
        payload: param,
      });
    },
  }),
)
class App extends React.Component {

  state = {
    editUserVisible: false,
  };

  columns = [
    {
      title: '账号',
      dataIndex: 'userId',
    },
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: '角色',
      dataIndex: 'roles',
      render: roles => {
        let text = [];
        roles.forEach(role => text.push(role.roleName));
        return text.join(`，`);
      },
    },
    {
      title: '手机号码',
      dataIndex: 'phoneNumber',
      render: phoneNumber => phoneNumber ? phoneNumber : `-`
    },
    {
      title: '座机号码',
      dataIndex: 'telephoneNumber',
      render: telephoneNumber => telephoneNumber ? telephoneNumber : `-`
    },
    {
      title: '传真号码',
      dataIndex: 'faxNumber',
      render: faxNumber => faxNumber ? faxNumber : `-`
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: email => email ? email : `-`
    },
    {
      title: '创建人',
      dataIndex: 'createdUser',
      render: createdUser => createdUser ? createdUser : `-`
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
    },
    {
      title: '操作',
      key: 'operate',
      render: (text, record) => (
        <span>
          <Button type={'link'} size={'small'}>修改</Button>
          <Divider type="vertical" style={{margin: 0}} />
          <Button type={'link'} size={'small'} onClick={() => { this.props.changeState({rePassWordVisible: true}); this.rePwdUserId = record.userId }}>重置密码</Button>
          <Divider type="vertical" style={{margin: 0}} />
          <Button
            type={'link'}
            size={'small'}
            onClick={() => this.deleteUserInfo(this, `${record.userId}`)}
            disabled={record.userId === this.props.currentUser.userId}
          >删除</Button>
        </span>
      ),
    },
  ];

  componentDidMount() {
    this.props.queryUserInfos({ pageNum: 1, pageSize: 10 });
  }

  handleTableChange = pagination => {
    this.props.changeState({
      pagination: { ...pagination },
    });
    this.props.queryUserInfos({
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
      param: this.props.queryCondition,
    });
  };

  deleteUserInfo = (event, userId) => {
    Modal.confirm({
      title: '确定是否删除？',
      icon: <ExclamationCircleOutlined />,
      width: 300,
      onOk: () => {
        const userIds = [];
        if (userId) {
          userIds.push(userId);
        } else {
          this.props.selectedUserIds.forEach(item => {
            userIds.push(item);
          });
        }
        this.props.deleteUserInfo(userIds);
        Modal.destroyAll();
      },
      onCancel() {
        Modal.destroyAll();
        //console.log('Cancel');
      },
    });
  };

  pwdForm = null;
  rePwdUserId = null;
  handleOk = () => {
    this.pwdForm.validateFields().then(values => {
      this.props.resetPassword({ userId: this.rePwdUserId , password: MD5(values.password).toString() });
    }).catch(error => {
      //console.log(error);
    });

  };
  render() {
    const hasSelected = this.props.selectedUserIds.length > 0;
    const rowSelection = {
      selectedRowKeys: this.props.selectedUserIds,
      onChange: (selectedRowKeys, selectedRows) => {

        this.props.changeState({
          selectedUserIds: selectedRowKeys
        });
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.userId === this.props.currentUser.userId, // Column configuration not to be checked
        name: record.userId,
      }),
    };
    return (
      <PageHeaderWrapper className={styles.main}>
        <Search />
        <div>
          <div style={{ marginBottom: 8 }}>
            <Button type="primary" onClick={() => { this.setState({editUserVisible: true}) }}>
              新增
            </Button>
            <Button
              type="primary"
              disabled={!hasSelected}
              onClick={this.deleteUserInfo}
              style={{ marginLeft: 8, display: !hasSelected ? 'none' : '' }}
            >
              删除
            </Button>
          </div>
          <Table
            columns={this.columns}
            dataSource={this.props.data}
            pagination={{
              ...this.props.pagination,
              showSizeChanger: true,
              showTotal: total => `共 ${total} 条记录`,
            }}
            loading={this.props.loading}
            onChange={this.handleTableChange}
            rowSelection={rowSelection}
            size={'middle'}
            rowKey={'userId'}
          />
          <Modal
            title="密码重置"
            visible={this.props.rePassWordVisible}
            onOk={this.handleOk}
            onCancel={() => { this.props.changeState({rePassWordVisible: false}) }}
            confirmLoading={this.props.confirmLoading}
            destroyOnClose={true}
          >
            <Form layout="vertical" ref={form => this.pwdForm = form}>
              <Form.Item name={'password'} label={'密码'} rules={[{required: true, message: '请输入密码'}]}>
                <Input.Password placeholder={'请输入密码'} />
              </Form.Item>
              <Form.Item
                name={'confirm'}
                label={'确认密码'}
                rules={[
                  {required: true, message: '请输入密码'},
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('两次输入的密码不一致!');
                    },
                  })
                ]}
                dependencies={['password']}
              >
                <Input.Password placeholder={'请输入密码'} />
              </Form.Item>
            </Form>
          </Modal>
          <Modal title={'新增用户'}
                 visible={this.state.editUserVisible}
                 destroyOnClose={true}
                 maskClosable={false}
                 onCancel={() => { this.setState({editUserVisible: false}) }}
          >
            <EditUser />
          </Modal>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default App;
