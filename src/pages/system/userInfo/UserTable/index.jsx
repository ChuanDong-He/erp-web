import React from 'react';
import { Table, Button, Divider, Popconfirm, Modal, Input, Form, Row, Col } from 'antd';
import styles from './index.less';
//import EditUserInfo from '../EditUserInfo';
import { connect } from 'umi';

@connect(
  ({ userInfo, loading, user }) => ({
    ...userInfo,
    currentUser: user.currentUser,
    loading: loading.effects['userInfo/queryUserInfo'],
  }),
  dispatch => ({
    queryUserInfo: param => {
      dispatch({
        type: 'userInfo/queryUserInfo',
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
  }),
)
class App extends React.Component {
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
      render: phoneNumber => {
        return phoneNumber ? phoneNumber : `-`;
      },
    },
    {
      title: '座机号码',
      dataIndex: 'telephoneNumber',
      render: telephoneNumber => {
        return telephoneNumber ? telephoneNumber : `-`;
      },
    },
    {
      title: '传真号码',
      dataIndex: 'faxNumber',
      render: faxNumber => {
        return faxNumber ? faxNumber : `-`;
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: email => {
        return email ? email : `-`;
      },
    },
    {
      title: '操作',
      key: 'operate',
      render: (text, record) => (
        <span>
          <Button type={'link'} size={'small'}>修改</Button>
          <Divider type="vertical" style={{margin: 0}} />
          <Button type={'link'} size={'small'} onClick={() => { this.props.changeState({rePassWordVisible: true}) }}>重置密码</Button>
          <Divider type="vertical" style={{margin: 0}} />
          <Popconfirm
            title="确认删除？"
            onConfirm={() => this.deleteUserInfo(this, `${record.userId}`)}
            disabled={record.userId === this.props.currentUser.userId}
          >
            <Button
              type={'link'}
              size={'small'}
              disabled={record.userId === this.props.currentUser.userId || record.userId === 'admin'}
            >删除</Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  componentDidMount() {
    this.props.queryUserInfo({ pageNum: 1, pageSize: 10 });
  }

  handleTableChange = pagination => {
    this.props.changeState({
      pagination: { ...pagination },
    });
    this.props.queryUserInfo({
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
      param: this.props.queryCondition,
    });
  };

  deleteUserInfo = (event, userId) => {
    const userIds = [];
    if (userId) {
      userIds.push(userId);
    } else {
      this.props.selectedUserIds.forEach(item => {
        userIds.push(item);
      });
    }
    this.props.deleteUserInfo(userIds);
  };

  addUserInfo = () => {
    this.setState({ userInfoVisible: true });
  };

  pwdForm = null;
  handleOk = e => {
    this.pwdForm.validateFields().then(values => {
      console.log(values);
    }).catch(error => {
      console.log(error);
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
        disabled: record.userId === 'admin' || record.userId === this.props.currentUser.userId, // Column configuration not to be checked
        name: record.userId,
      }),
    };
    return (
      <div>
        <div style={{ marginBottom: 8 }}>
          <Button type="primary" onClick={this.addUserInfo}>
            新增
          </Button>
          <Popconfirm title="确认删除？" onConfirm={this.deleteUserInfo} disabled={!hasSelected}>
            <Button type="primary" disabled={!hasSelected} style={{ marginLeft: 8 }}>
              删除
            </Button>
          </Popconfirm>
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
          title="新增用户"
          visible={this.props.userInfoVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose={true}
        >
          {/*<EditUserInfo />*/}
        </Modal>
        <Modal
          title="密码重置"
          visible={this.props.rePassWordVisible}
          onOk={this.handleOk}
          onCancel={() => { this.props.changeState({rePassWordVisible: false}) }}
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
                    return Promise.reject('The two passwords that you entered do not match!');
                  },
                })
                ]}
              dependencies={['password']}
            >
              <Input.Password placeholder={'请输入密码'} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default () => (
  <div className={styles.container}>
    <div id="components-table-demo-ajax">
      <App />
    </div>
  </div>
);
