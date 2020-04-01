import React from 'react';
import { Table, notification, Button, Divider, Popconfirm, Modal } from 'antd';
import styles from './index.less';
//import EditUserInfo from '../EditUserInfo';
import { connect } from 'umi';

@connect(
  ({ userInfo, loading }) => ({
    ...userInfo,
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
          <a>修改</a>
          <Divider type="vertical" />
          <a>重置密码</a>
          <Divider type="vertical" />
          <Popconfirm
            title="确认删除？"
            onConfirm={() => this.deleteUserInfo(this, `${record.userId}`)}
          >
            <a>删除</a>
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

  handleOk = e => {
    console.log(e);
    this.setState({
      userInfoVisible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      userInfoVisible: false,
    });
  };

  render() {
    const hasSelected = this.props.selectedRowKeys.length > 0;
    const rowSelection = {
      selectedRowKeys: this.props.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        const selectedUserIds = [];
        console.log(selectedRowKeys);
        selectedRows.forEach(row => {
          selectedUserIds.push(row.userId);
        });
        this.props.changeState({
          selectedUserIds: selectedUserIds,
          selectedRowKeys: selectedRowKeys,
        });
        //this.setState({selectedUserIds: selectedUserIds});
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.userId === 'admin', // Column configuration not to be checked
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
            showTotal: total => {
              `共${total}条记录`;
            },
          }}
          loading={this.props.loading}
          onChange={this.handleTableChange}
          rowSelection={rowSelection}
          size={'middle'}
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
