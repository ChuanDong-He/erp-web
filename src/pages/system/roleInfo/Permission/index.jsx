import React from 'react';
import {Modal, Tabs, Tree, Spin} from 'antd';
import { connect } from 'umi';

@connect(
  ({ roleInfo, loading }) => ({
    ...roleInfo,
    menuLoading: loading.effects['roleInfo/queryRoleMenuPermission'],
    savePermissionLoading: loading.effects['roleInfo/saveRolePermission'],
  }),
  (dispatch) => ({
  changeState: (state) => {
    dispatch({
      type: 'roleInfo/changeState',
      newState: state
    })
  },
  saveRolePermission: param => {
    dispatch({
      type: 'roleInfo/saveRolePermission',
      payload: param
    })
  },
}))
class Permission extends React.Component{

  constructor(props) {
    super(props);
  }

  okHandle = () => {
    console.log(this.props.roleId);
    this.props.saveRolePermission({
      roleId: this.props.roleId,
      menuPermission: this.props.roleMenuPermissionKeys,
    });
    //this.props.changeState({permissionVisible: false});
  };

  onCheck = checkedKeys => {
    this.props.changeState({
      roleMenuPermissionKeys: checkedKeys
    });
  };

  render() {
    let menuPermission;
    if (this.props.menuLoading) {
      menuPermission = (
        <div style={{'textAlign': 'center', 'margin': '20px 0', 'padding': '30px 50px'}}>
          <Spin tip="Loading..." spinning={this.props.menuLoading} />
        </div>
      );
    } else {
      menuPermission = (
        <Tree
          checkable={true}
          treeData={this.props.menuTreeInfos}
          defaultCheckedKeys={this.props.roleMenuPermissionKeys}
          defaultExpandAll={true}
          selectable={false}
          onCheck={this.onCheck}
        />
      );
    }
    return (
      <Modal
        title={'权限配置'}
        visible={this.props.permissionVisible}
        width={600}
        destroyOnClose={true}
        onCancel={() => {this.props.changeState({permissionVisible: false})}}
        confirmLoading={this.props.savePermissionLoading}
        onOk={this.okHandle}
      >
        <Tabs defaultActiveKey={'1'} tabPosition={'left'}>
          <Tabs.TabPane key={'1'} tab={'菜单配置'} style={{outline: "none"}}>
            {menuPermission}
          </Tabs.TabPane>
          <Tabs.TabPane key={'2'} tab={'数据配置'} style={{outline: "none"}}>数据配置</Tabs.TabPane>
          <Tabs.TabPane key={'3'} tab={'功能配置'} style={{outline: "none"}}>功能配置</Tabs.TabPane>
        </Tabs>
      </Modal>
    )
  }
}

export default Permission;
