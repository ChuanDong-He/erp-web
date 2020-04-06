import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { Table, Button, Divider, Popconfirm, Modal, Input, Form} from 'antd';
import styles from '@/utils/default.less';
import Search from './Search';
import Permission from "./Permission";
import { connect } from 'umi';

@connect(
  ({ roleInfo, loading, user }) => ({
    ...roleInfo,
    currentUser: user.currentUser,
    loading: loading.effects['roleInfo/queryRoleInfos'],
  }),
  dispatch => ({
    queryRoleInfos: param => {
      dispatch({
        type: 'roleInfo/queryRoleInfos',
        payload: param,
      });
    },
    changeState: (state) => {
      dispatch({
        type: 'roleInfo/changeState',
        newState: state,
      });
    },
    deleteRoleInfo: param => {
      dispatch({
        type: 'roleInfo/deleteRoleInfo',
        payload: param,
      });
    },
    queryRoleMenuPermission: param => {
      dispatch({
        type: 'roleInfo/queryRoleMenuPermission',
        payload: param
      })
    },
    queryRoleAttrPermission: param => {
      dispatch({
        type: 'roleInfo/queryRoleAttrPermission',
        payload: param
      })
    },
  }),
)
class App extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      roleId: ''
    };
  }
  columns = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '角色描述',
      dataIndex: 'roleDesc',
      render: roleDesc =>  roleDesc ? roleDesc : `-`
    },
    {
      title: '创建人',
      dataIndex: 'createdUser',
      render: createdUser =>  createdUser ? createdUser : `-`
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
          <Button type={'link'} size={'small'} disabled={'ADMIN' === record.roleId}>修改</Button>
          <Divider type="vertical" style={{margin: 0}} />
          <Button
            type={'link'}
            size={'small'}
            disabled={'ADMIN' === record.roleId}
            onClick={() => this.permissionOperate(record.roleId)}
          >权限</Button>
          <Divider type="vertical" style={{margin: 0}} />
          <Button
            type={'link'}
            size={'small'}
            disabled={'ADMIN' === record.roleId}
            onClick={() => this.deleteRoleInfo(this, `${record.roleId}`)}
          >删除</Button>
        </span>
      ),
    },
  ];

  componentDidMount() {
    this.props.queryRoleInfos({ pageNum: 1, pageSize: 10 });
  }

  permissionOperate(roleId) {
    this.props.changeState({permissionVisible: true});
    this.props.queryRoleMenuPermission({roleId: roleId});
    this.props.queryRoleAttrPermission({roleId: roleId});
    this.setState({roleId: roleId});
  }

  deleteRoleInfo = (event, roleId) => {
    Modal.confirm({
      title: '确定是否删除？',
      icon: <ExclamationCircleOutlined />,
      width: 300,
      onOk: () => {
        const roleIds = [];
        if (roleId) {
          roleIds.push(roleId);
        } else {
          this.props.selectedRoleIds.forEach(item => {
            roleIds.push(item);
          });
        }
        this.props.deleteRoleInfo(roleIds);
      },
      onCancel() {
        //console.log('Cancel');
      },
    });
  };

  render() {
    const hasSelected = this.props.selectedRoleIds.length > 0;
    const rowSelection = {
      selectedRowKeys: this.props.selectedRoleIds,
      onChange: (selectedRowKeys, selectedRows) => {

        this.props.changeState({
          selectedRoleIds: selectedRowKeys
        });
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.roleId === 'ADMIN', // Column configuration not to be checked
        name: record.roleId,
      }),
    };
    return (
      <PageHeaderWrapper className={styles.main}>
        <Search />
        <div>
          <div style={{ marginBottom: 8 }}>
            <Button type="primary">
              新增
            </Button>
            <Button
              type="primary"
              disabled={!hasSelected}
              onClick={this.deleteRoleInfo}
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
            rowKey={'roleId'}
          />
        </div>
        <Permission roleId={this.state.roleId} />
      </PageHeaderWrapper>
    );
  }
}

export default App;
